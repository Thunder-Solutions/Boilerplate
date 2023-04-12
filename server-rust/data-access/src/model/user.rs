use async_graphql::Object;
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

#[Object]
impl User {
    async fn id(&self) -> &ObjectId {
        &self.id
    }

    async fn username(&self) -> &str {
        &self.username
    }

    async fn display_name(&self) -> &str {
        &self.display_name
    }

    async fn email(&self) -> &str {
        &self.email
    }
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
