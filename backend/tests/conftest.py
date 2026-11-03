import pytest

from alandia import create_app


@pytest.fixture
def app(tmp_path):
    return create_app(
        {
            "TESTING": True,
            "SECRET_KEY": "test-secret",
            "DATABASE": str(tmp_path / "test.sqlite3"),
            "AUTO_INIT_DB": True,
        }
    )


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def register(client):
    def _register(pseudo="rakoto", email="rakoto@example.com", password="motdepasse"):
        res = client.post(
            "/api/auth/register", json={"pseudo": pseudo, "email": email, "password": password}
        )
        assert res.status_code == 201, res.json
        return res.json

    return _register


@pytest.fixture
def auth_headers(register):
    token = register()["token"]
    return {"Authorization": f"Bearer {token}"}
