def test_health(client):
    assert client.get("/api/health").json == {"status": "ok"}


def test_lists_all_35_parks_sorted_by_name(client):
    parks = client.get("/api/parks").json["parks"]
    assert len(parks) == 35
    names = [p["name"] for p in parks]
    assert names == sorted(names)


def test_park_has_coordinates_in_madagascar(client):
    for park in client.get("/api/parks").json["parks"]:
        assert -26 < park["latitude"] < -11, park["name"]
        assert 43 < park["longitude"] < 51, park["name"]


def test_kirindy_mitea_is_in_toliara(client):
    park = client.get("/api/parks/28").json["park"]
    assert park["province"]["name"] == "Toliara"


def test_search_by_name_or_description(client):
    parks = client.get("/api/parks", query_string={"q": "Isalo"}).json["parks"]
    assert [p["id"] for p in parks] == [19]
    lemurs = client.get("/api/parks", query_string={"q": "lémuriens"}).json["parks"]
    assert len(lemurs) >= 2


def test_filter_by_province(client):
    parks = client.get("/api/parks", query_string={"province": 1}).json["parks"]
    assert parks and all(p["province"]["name"] == "Antananarivo" for p in parks)


def test_provinces_with_counts(client):
    provinces = client.get("/api/provinces").json["provinces"]
    assert len(provinces) == 6
    assert sum(p["park_count"] for p in provinces) == 35


def test_park_detail_with_wikipedia_link(client):
    park = client.get("/api/parks/19").json["park"]
    assert park["wikipedia"]["lang"] == "fr"
    assert park["wikipedia"]["url"] == "https://fr.wikipedia.org/wiki/Parc_national_de_l%27Isalo"
    assert park["comments"] == []


def test_unknown_park_is_404(client):
    res = client.get("/api/parks/999")
    assert res.status_code == 404
    assert res.json["error"] == "Parc introuvable."


def test_rating_requires_login(client):
    assert client.put("/api/parks/1/rating", json={"score": 5}).status_code == 401


def test_rate_then_change_rating(client, auth_headers):
    before = client.get("/api/parks/1").json["park"]["rating_count"]
    res = client.put("/api/parks/1/rating", json={"score": 5}, headers=auth_headers)
    assert res.status_code == 200
    assert res.json["rating_count"] == before + 1

    res = client.put("/api/parks/1/rating", json={"score": 2}, headers=auth_headers)
    assert res.json["rating_count"] == before + 1
    mine = client.get("/api/parks/1/my-rating", headers=auth_headers).json
    assert mine == {"score": 2}


def test_rating_must_be_between_1_and_5(client, auth_headers):
    for score in (0, 6, "5", True, 4.5):
        res = client.put("/api/parks/1/rating", json={"score": score}, headers=auth_headers)
        assert res.status_code == 400, score


def test_add_comment(client, auth_headers):
    res = client.post("/api/parks/4/comments", json={"body": "  Superbe !  "}, headers=auth_headers)
    assert res.status_code == 201
    assert res.json["comment"]["body"] == "Superbe !"
    comments = client.get("/api/parks/4").json["park"]["comments"]
    assert [(c["author"], c["body"]) for c in comments] == [("rakoto", "Superbe !")]


def test_empty_or_too_long_comment_is_rejected(client, auth_headers):
    for body in ("   ", "x" * 501):
        res = client.post("/api/parks/4/comments", json={"body": body}, headers=auth_headers)
        assert res.status_code == 400


def test_forum_has_seed_posts_from_demo_users(client):
    posts = client.get("/api/forum").json["posts"]
    assert len(posts) == 5
    assert all(p["author"].startswith("demo") for p in posts)


def test_new_forum_post_comes_first(client, auth_headers):
    res = client.post(
        "/api/forum", json={"body": "Quel parc pour voir des baobabs ?"}, headers=auth_headers
    )
    assert res.status_code == 201
    first = client.get("/api/forum").json["posts"][0]
    assert first["body"] == "Quel parc pour voir des baobabs ?"
    assert first["author"] == "rakoto"
