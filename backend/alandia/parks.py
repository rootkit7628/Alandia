from typing import Any
from urllib.parse import quote

from flask import Blueprint, g, request

from .auth import login_required
from .db import get_db
from .errors import ApiError, json_body

bp = Blueprint("parks", __name__, url_prefix="/api")

COMMENT_MAX = 500
POST_MAX = 800

PARK_SELECT = """
    SELECT p.id, p.name, p.description, p.latitude, p.longitude, p.phone, p.wikipedia,
           pr.id AS province_id, pr.name AS province_name,
           ROUND(AVG(r.score), 1) AS rating, COUNT(r.score) AS rating_count
    FROM park p
    JOIN province pr ON pr.id = p.province_id
    LEFT JOIN rating r ON r.park_id = p.id
"""


def _wikipedia(value: str | None) -> dict[str, str] | None:
    if not value:
        return None
    lang, title = value.split(":", 1)
    return {
        "lang": lang,
        "title": title,
        "url": f"https://{lang}.wikipedia.org/wiki/{quote(title.replace(' ', '_'))}",
    }


def _park(row: Any) -> dict[str, Any]:
    return {
        "id": row["id"],
        "name": row["name"],
        "description": row["description"],
        "latitude": row["latitude"],
        "longitude": row["longitude"],
        "phone": row["phone"],
        "province": {"id": row["province_id"], "name": row["province_name"]},
        "rating": row["rating"],
        "rating_count": row["rating_count"],
        "wikipedia": _wikipedia(row["wikipedia"]),
    }


def _text(body: dict[str, Any], limit: int) -> str:
    text = str(body.get("body", "")).strip()
    if not text:
        raise ApiError(400, "Le message est vide.")
    if len(text) > limit:
        raise ApiError(400, f"Le message dépasse {limit} caractères.")
    return text


def _get_park_or_404(park_id: int) -> Any:
    row = get_db().execute(PARK_SELECT + " WHERE p.id = ? GROUP BY p.id", (park_id,)).fetchone()
    if row is None:
        raise ApiError(404, "Parc introuvable.")
    return row


@bp.get("/provinces")
def provinces():
    rows = (
        get_db()
        .execute(
            """SELECT pr.id, pr.name, COUNT(p.id) AS park_count
           FROM province pr LEFT JOIN park p ON p.province_id = pr.id
           GROUP BY pr.id ORDER BY pr.name"""
        )
        .fetchall()
    )
    return {"provinces": [dict(r) for r in rows]}


@bp.get("/parks")
def parks():
    where, params = [], []
    if q := request.args.get("q", "").strip():
        where.append("(p.name LIKE ? OR p.description LIKE ?)")
        params += [f"%{q}%", f"%{q}%"]
    if province := request.args.get("province", type=int):
        where.append("p.province_id = ?")
        params.append(province)
    sql = PARK_SELECT + (" WHERE " + " AND ".join(where) if where else "")
    rows = get_db().execute(sql + " GROUP BY p.id ORDER BY p.name", params).fetchall()
    return {"parks": [_park(r) for r in rows]}


@bp.get("/parks/<int:park_id>")
def park_detail(park_id: int):
    park = _park(_get_park_or_404(park_id))
    comments = (
        get_db()
        .execute(
            """SELECT c.id, c.body, c.created_at, u.pseudo AS author
           FROM comment c JOIN app_user u ON u.id = c.user_id
           WHERE c.park_id = ? ORDER BY c.created_at DESC, c.id DESC""",
            (park_id,),
        )
        .fetchall()
    )
    park["comments"] = [dict(c) for c in comments]
    return {"park": park}


@bp.get("/parks/<int:park_id>/my-rating")
@login_required
def my_rating(park_id: int):
    _get_park_or_404(park_id)
    row = (
        get_db()
        .execute(
            "SELECT score FROM rating WHERE user_id = ? AND park_id = ?", (g.user["id"], park_id)
        )
        .fetchone()
    )
    return {"score": row["score"] if row else None}


@bp.put("/parks/<int:park_id>/rating")
@login_required
def rate(park_id: int):
    _get_park_or_404(park_id)
    score = json_body().get("score")
    if not isinstance(score, int) or isinstance(score, bool) or not 1 <= score <= 5:
        raise ApiError(400, "La note doit être un entier de 1 à 5.")
    db = get_db()
    db.execute(
        """INSERT INTO rating (user_id, park_id, score) VALUES (?, ?, ?)
           ON CONFLICT (user_id, park_id) DO UPDATE SET score = excluded.score""",
        (g.user["id"], park_id, score),
    )
    db.commit()
    park = _get_park_or_404(park_id)
    return {"score": score, "rating": park["rating"], "rating_count": park["rating_count"]}


@bp.post("/parks/<int:park_id>/comments")
@login_required
def add_comment(park_id: int):
    _get_park_or_404(park_id)
    text = _text(json_body(), COMMENT_MAX)
    db = get_db()
    cur = db.execute(
        "INSERT INTO comment (park_id, user_id, body) VALUES (?, ?, ?)",
        (park_id, g.user["id"], text),
    )
    db.commit()
    row = db.execute(
        "SELECT id, body, created_at FROM comment WHERE id = ?", (cur.lastrowid,)
    ).fetchone()
    return {"comment": {**dict(row), "author": g.user["pseudo"]}}, 201


@bp.get("/forum")
def forum():
    rows = (
        get_db()
        .execute(
            """SELECT f.id, f.body, f.created_at, u.pseudo AS author
           FROM forum_post f JOIN app_user u ON u.id = f.user_id
           ORDER BY f.created_at DESC, f.id DESC"""
        )
        .fetchall()
    )
    return {"posts": [dict(r) for r in rows]}


@bp.post("/forum")
@login_required
def add_post():
    text = _text(json_body(), POST_MAX)
    db = get_db()
    cur = db.execute("INSERT INTO forum_post (user_id, body) VALUES (?, ?)", (g.user["id"], text))
    db.commit()
    row = db.execute(
        "SELECT id, body, created_at FROM forum_post WHERE id = ?", (cur.lastrowid,)
    ).fetchone()
    return {"post": {**dict(row), "author": g.user["pseudo"]}}, 201
