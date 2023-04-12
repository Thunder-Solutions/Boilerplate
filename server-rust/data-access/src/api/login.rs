use crate::{error::Error, model::User};
use async_graphql::SimpleObject;
use bson::{doc, oid::ObjectId};
use mongodb::Database;
use serde::{Deserialize, Serialize};
use std::env::var;
use utilities::{generate_token, is_password_correct};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AccessToken {
    pub id: ObjectId,
    pub username: String,
    pub email: String,
    pub exp: usize,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RefreshToken {
    pub sub: ObjectId,
    pub username: String,
    pub email: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, SimpleObject)]
pub struct LoginResponse {
    pub id: ObjectId,
    pub username: String,
    pub display_name: String,
    pub email: String,
    pub access_token: String,
    pub refresh_token: String,
}

pub async fn login(
    database: &Database,
    username: String,
    password: String,
) -> Result<LoginResponse, Error> {
    let users = database.collection::<User>("user");
    let user = users
        .find_one(doc! { "username" : username}, None)
        .await?
        .ok_or(Error::LoginError)?;
    if !is_password_correct(&password, &user.hash, &user.salt).map_err(|_| Error::HashError)? {
        return Err(Error::LoginError);
    }

    let access_token = generate_token(
        &AccessToken {
            id: user.id,
            username: user.username.clone(),
            email: user.email.clone(),
            exp: (chrono::offset::Utc::now() + chrono::Duration::minutes(15)).timestamp() as usize,
        },
        &var("ACCESS_TOKEN_SECRET").expect("access token secret not preset!"),
    )
    .map_err(|_| Error::LoginError)?;

    let refresh_token = generate_token(
        &RefreshToken {
            sub: user.id,
            username: user.username.clone(),
            email: user.email.clone(),
        },
        &var("ACCESS_TOKEN_SECRET").expect("access token secret not preset!"),
    )
    .map_err(|_| Error::LoginError)?;

    users
        .find_one_and_update(
            doc! { "username" : &user.username},
            doc! { "$push" : { "tokens" : &refresh_token}},
            None,
        )
        .await?;

    let login_response = LoginResponse {
        id: user.id,
        username: user.username,
        display_name: user.display_name,
        email: user.email,
        access_token,
        refresh_token,
    };
    Ok(login_response)
}
