import re
import sqlite3
from collections.abc import Callable
from functools import wraps
from typing import Any

from flask import Blueprint, current_app, g, request
from itsdangerous import BadSignature, URLSafeTimedSerializer
from werkzeug.security import check_password_hash, generate_password_hash

from .db import get_db
from .errors import ApiError, json_body

bp = Blueprint("auth", __name__, url_prefix="/api/auth")

TOKEN_MAX_AGE = 30 * 24 * 3600
PSEUDO_RE = re.compile(r"^[\w.-]{3,30}$")
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def _serializer() -> URLSafeTimedSerializer:
    return URLSafeTimedSerializer(current_app.config["SECRET_KEY"], salt="alandia-auth")


def make_token(user_id: int) -> str:
    return _serializer().dumps({"uid": user_id})


def _public(user: sqlite3.Row) -> dict[str, Any]:
    return {"id": user["id"], "pseudo": user["pseudo"]}


def login_required(view: Callable) -> Callable:
    @wraps(view)
    def wrapped(*args, **kwargs):
        header = request.headers.get("Authorization", "")
        if not header.startswith("Bearer "):
            raise ApiError(401, "Connexion requise.")
        try:
            data = _serializer().loads(header.removeprefix("Bearer "), max_age=TOKEN_MAX_AGE)
        except BadSignature as exc:
            raise ApiError(401, "Session expirée, reconnecte-toi.") from exc
        user = (
            get_db()
            .execute("SELECT id, pseudo FROM app_user WHERE id = ?", (data["uid"],))
            .fetchone()
        )
        if user is None:
            raise ApiError(401, "Compte introuvable.")
        g.user = user
        return view(*args, **kwargs)

    return wrapped


@bp.post("/register")
def register():
    body = json_body()
    pseudo = str(body.get("pseudo", "")).strip()
    email = str(body.get("email", "")).strip().lower()
    password = str(body.get("password", ""))

    if not PSEUDO_RE.match(pseudo):
        raise ApiError(400, "Le pseudo doit faire 3 à 30 caractères (lettres, chiffres, . _ -).")
    if not EMAIL_RE.match(email):
        raise ApiError(400, "Adresse email invalide.")
    if len(password) < 8:
        raise ApiError(400, "Le mot de passe doit faire au moins 8 caractères.")

    db = get_db()
    try:
        cur = db.execute(
            "INSERT INTO app_user (pseudo, email, password_hash) VALUES (?, ?, ?)",
            (pseudo, email, generate_password_hash(password)),
        )
        db.commit()
    except sqlite3.IntegrityError as exc:
        raise ApiError(409, "Ce pseudo ou cet email est déjà utilisé.") from exc

    user = {"id": cur.lastrowid, "pseudo": pseudo}
    return {"token": make_token(user["id"]), "user": user}, 201


@bp.post("/login")
def login():
    body = json_body()
    login_name = str(body.get("login", "")).strip()
    password = str(body.get("password", ""))

    user = (
        get_db()
        .execute(
            "SELECT id, pseudo, password_hash FROM app_user WHERE pseudo = ? OR email = ?",
            (login_name, login_name.lower()),
        )
        .fetchone()
    )
    # Demo accounts store "!" as their hash: check_password_hash rejects it, so they cannot log in.
    if user is None or not check_password_hash(user["password_hash"], password):
        raise ApiError(401, "Pseudo/email ou mot de passe incorrect.")
    return {"token": make_token(user["id"]), "user": _public(user)}


@bp.get("/me")
@login_required
def me():
    return {"user": _public(g.user)}
