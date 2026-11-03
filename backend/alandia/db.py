import sqlite3
from importlib.resources import files
from pathlib import Path

import click
from flask import Flask, current_app, g


def get_db() -> sqlite3.Connection:
    if "db" not in g:
        g.db = sqlite3.connect(current_app.config["DATABASE"])
        g.db.row_factory = sqlite3.Row
        g.db.execute("PRAGMA foreign_keys = ON")
    return g.db


def close_db(_exc: BaseException | None = None) -> None:
    db = g.pop("db", None)
    if db is not None:
        db.close()


def init_db(seed: bool = True) -> None:
    """Create the schema and, unless told otherwise, load the parks and demo data."""
    db = get_db()
    package = files("alandia")
    db.executescript(package.joinpath("schema.sql").read_text(encoding="utf-8"))
    if seed:
        db.executescript(package.joinpath("seed.sql").read_text(encoding="utf-8"))
    db.commit()


@click.command("init-db")
@click.option("--force", is_flag=True, help="Delete the existing database first.")
def init_db_command(force: bool) -> None:
    """Create the SQLite database with the 35 parks."""
    path = Path(current_app.config["DATABASE"])
    if path.exists():
        if not force:
            raise click.ClickException(f"{path} already exists (use --force to recreate it).")
        close_db()
        path.unlink()
    init_db()
    click.echo(f"Database created: {path}")


def init_app(app: Flask) -> None:
    app.teardown_appcontext(close_db)
    app.cli.add_command(init_db_command)

    path = Path(app.config["DATABASE"])
    if app.config.get("AUTO_INIT_DB") and not path.exists():
        path.parent.mkdir(parents=True, exist_ok=True)
        with app.app_context():
            init_db()
