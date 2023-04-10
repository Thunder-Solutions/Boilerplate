use bson::oid::ObjectId;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct User {
    #[serde(rename = "_id")]
    pub id: ObjectId,
    pub username: String,
    pub display_name: String,
    pub email: String,
    pub hash: String,
    pub salt: String,
    pub tokens: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LoginUser {
    #[serde(rename = "_id")]
    pub id: ObjectId,
    pub username: String,
    pub display_name: String,
    pub email: String,
    pub access_token: String,
    pub refresh_token: String,
}
