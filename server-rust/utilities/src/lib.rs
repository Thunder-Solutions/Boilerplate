use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use pbkdf2::{
    password_hash::{Error, PasswordHasher, Salt, SaltString},
    Pbkdf2,
};
use rand_core::OsRng;
use serde::{de::DeserializeOwned, Serialize};

mod test;

fn hash_password<'a>(password: &'a str, salt: impl Into<Salt<'a>>) -> Result<String, Error> {
    Pbkdf2
        .hash_password(password.as_bytes(), salt)
        .map(|password_bytes| password_bytes.to_string())
}

/// Function used to generate a new password
/// Returns a Hash and a salt
pub fn new_hash_password<'a>(password: &'a str) -> Result<(String, String), Error> {
    let salt = SaltString::generate(&mut OsRng);
    let password_hash = hash_password(password, &salt)?;
    Ok((password_hash, salt.to_string()))
}

/// Function checks if password is correct or not
pub fn is_password_correct<'a>(
    password: &'a str,
    saved_hash: &'a str,
    saved_salt: &'a str,
) -> Result<bool, Error> {
    let hash = hash_password(password, &SaltString::from_b64(saved_salt)?)?;
    return Ok(hash == saved_hash);
}

pub fn generate_token<'a, T: Serialize>(
    claims: &'a T,
    secret: &'a str,
) -> Result<String, jsonwebtoken::errors::Error> {
    encode(
        &Header::default(),
        claims,
        &EncodingKey::from_secret(secret.as_bytes()),
    )
}

pub fn decode_token<'a, T: DeserializeOwned>(
    token: &'a str,
    secret: &'a str,
) -> Result<T, jsonwebtoken::errors::Error> {
    let res = decode(
        token,
        &DecodingKey::from_secret(secret.as_bytes()),
        &Validation::new(jsonwebtoken::Algorithm::default()),
    )?;
    Ok(res.claims)
}
