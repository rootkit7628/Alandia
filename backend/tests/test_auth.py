import pytest


def test_register_returns_token_and_user(register):
    data = register()
    assert data["user"]["pseudo"] == "rakoto"
    assert data["token"]


def test_password_is_hashed(app, register):
    register()
    from alandia.db import get_db

    with app.app_context():
        stored = get_db().execute("SELECT password_hash FROM app_user WHERE pseudo = 'rakoto'")
        assert "motdepasse" not in stored.fetchone()["password_hash"]


@pytest.mark.parametrize(
    "payload, message",
    [
        ({"pseudo": "ab", "email": "a@b.mg", "password": "12345678"}, "pseudo"),
        ({"pseudo": "abc", "email": "pas-un-email", "password": "12345678"}, "email"),
        ({"pseudo": "abc", "email": "a@b.mg", "password": "court"}, "8 caractères"),
    ],
)
def test_register_validates_input(client, payload, message):
    res = client.post("/api/auth/register", json=payload)
    assert res.status_code == 400
    assert message in res.json["error"]


def test_register_rejects_duplicates_case_insensitively(client, register):
    register()
    res = client.post(
        "/api/auth/register",
        json={"pseudo": "RAKOTO", "email": "autre@example.com", "password": "motdepasse"},
    )
    assert res.status_code == 409


def test_login_with_pseudo_or_email(client, register):
    register()
    for login in ("rakoto", "Rakoto@Example.com"):
        res = client.post("/api/auth/login", json={"login": login, "password": "motdepasse"})
        assert res.status_code == 200
        assert res.json["user"]["pseudo"] == "rakoto"


def test_login_rejects_wrong_password(client, register):
    register()
    res = client.post("/api/auth/login", json={"login": "rakoto", "password": "mauvais!!"})
    assert res.status_code == 401


def test_demo_accounts_cannot_log_in(client):
    for password in ("", "!", "demo1"):
        res = client.post("/api/auth/login", json={"login": "demo1", "password": password})
        assert res.status_code == 401


def test_me_requires_a_valid_token(client, auth_headers):
    assert client.get("/api/auth/me").status_code == 401
    assert client.get("/api/auth/me", headers={"Authorization": "Bearer faux"}).status_code == 401
    res = client.get("/api/auth/me", headers=auth_headers)
    assert res.json["user"]["pseudo"] == "rakoto"


def test_token_from_another_secret_is_rejected(app, client, register):
    token = register()["token"]
    app.config["SECRET_KEY"] = "autre-secret"
    res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 401


def test_non_json_body_is_rejected(client):
    res = client.post("/api/auth/login", data="pas du json")
    assert res.status_code == 400


def test_app_refuses_to_start_without_secret(monkeypatch):
    from alandia import create_app

    monkeypatch.delenv("ALANDIA_SECRET_KEY", raising=False)
    monkeypatch.setattr("alandia.load_dotenv", lambda: None)
    with pytest.raises(RuntimeError, match="ALANDIA_SECRET_KEY"):
        create_app()
