"""Alandia API: Madagascar's national parks and reserves."""

import os
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS

from . import auth, db, errors, parks


def create_app(test_config: dict[str, Any] | None = None) -> Flask:
    load_dotenv()
    app = Flask(__name__, instance_relative_config=True)
    app.json.ensure_ascii = False

    if test_config is None:
        secret = os.environ.get("ALANDIA_SECRET_KEY")
        if not secret:
            raise RuntimeError(
                "ALANDIA_SECRET_KEY is not set. Copy .env.example to .env and fill it in."
            )
        app.config.from_mapping(
            SECRET_KEY=secret,
            DATABASE=os.environ.get(
                "ALANDIA_DATABASE", str(Path(app.instance_path) / "alandia.sqlite3")
            ),
            AUTO_INIT_DB=True,
        )
        origins = os.environ.get("ALANDIA_CORS_ORIGINS", "*")
    else:
        app.config.from_mapping(test_config)
        origins = "*"

    CORS(app, resources={r"/api/*": {"origins": origins.split(",")}})
    errors.init_app(app)
    db.init_app(app)
    app.register_blueprint(auth.bp)
    app.register_blueprint(parks.bp)

    @app.get("/api/health")
    def health():
        return {"status": "ok"}

    return app
