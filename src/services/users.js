const db = require("../configs/db");
const bcrypt = require("bcrypt");
const filesService = require("./files");

const saltRounds = 10;

module.exports = {
  createUser: async ({ firstName, lastName, email, password }) => {
    const existUser = await db.query(
      `
        SELECT * from "Users"
        where email='${email}'
      `
    );

    if (existUser.rows.length !== 0) return null;

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const res = await db.query(
      `
        INSERT INTO "Users"
        ("firstName", "lastName", "email", "password")
        VALUES ($1, $2, $3, $4) RETURNING *
      `,
      [firstName, lastName, email, hashedPassword]
    );

    return res.rows[0];
  },

  getUserById: async (id) => {
    const res = await db.query(
      `
        SELECT * from "Users"
        where id='${id}'
      `
    );

    return res.rows.length ? res.rows[0] : null;
  },

  update: async ({ id, firstName, lastName, refreshToken, avatar }) => {
    const res = await db.query(
      `
        SELECT * from "Users"
        where id='${id}'
      `
    );

    if (res.rows.length === 0) return false;
    if (res.rows[0].avatar) filesService.removeFile(res.rows[0].avatar);

    const currentUser = res.rows[0];
    const updatedUserData = [
      firstName || currentUser.firstName,
      lastName || currentUser.lastName,
      refreshToken || currentUser.refreshToken,
      avatar || currentUser.avatar,
      id,
    ];

    const rs = await db.query(
      `
        UPDATE "Users"
        SET "firstName" = $1, "lastName" = $2, "refreshToken" = $3, "avatar" = $4
        WHERE id = $5
        RETURNING *
      `,
      updatedUserData
    );

    return rs.rows[0];
  },

  updatePassword: async ({ id, newPassword }) => {
    const res = await db.query(
      `
        SELECT * from "Users"
        where id='${id}'
      `
    );
    if (res.rows.length === 0) return false;

    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    const rs = await db.query(
      `
        UPDATE "Users"
        SET "password" = $1
        WHERE id = $2
        RETURNING *
      `,
      [hashedPassword, id]
    );

    return rs.rows[0];
  },
};
