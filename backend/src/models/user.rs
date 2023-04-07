use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct User {
    username: String,
    display_name: String,
    email: String,
    hash: String,
    salt: String,
    tokens: Vec<String>,
}
