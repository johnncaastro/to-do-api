import 'dotenv/config'
import postgres from 'postgres'

const { DATABASE_URL } = process.env

export const sql = postgres(DATABASE_URL)