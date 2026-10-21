CREATE TABLE IF NOT EXISTS inquiries (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 name VARCHAR(100) NOT NULL, phone VARCHAR(30) NOT NULL, email VARCHAR(254) NOT NULL,
 service VARCHAR(40) NOT NULL CHECK (service IN ('lawn-care','pressure-washing','junk-removal','other')),
 location VARCHAR(200) NOT NULL, message TEXT NOT NULL,
 status VARCHAR(20) NOT NULL DEFAULT 'new' CHECK(status IN ('new','contacted','scheduled','closed')),
 notification_status VARCHAR(15) NOT NULL DEFAULT 'off' CHECK(notification_status IN ('off','sent','failed')),
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS inquiries_created_idx ON inquiries(created_at);
CREATE TABLE IF NOT EXISTS analytics_events (
 id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 event_type VARCHAR(15) NOT NULL CHECK (event_type IN ('pageview','inquiry')),
 path VARCHAR(100) NOT NULL,
 visitor_hash CHAR(64), visit_hash CHAR(64), source VARCHAR(40),
 device VARCHAR(10) CHECK(device IN ('mobile','tablet','desktop')),
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS analytics_created_idx ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS analytics_visit_idx ON analytics_events(visit_hash);
CREATE TABLE IF NOT EXISTS admin_sessions (
 token_hash CHAR(64) PRIMARY KEY, credential_version CHAR(64) NOT NULL,
 expires_at TIMESTAMPTZ NOT NULL
);
CREATE TABLE IF NOT EXISTS rate_limits (
 key CHAR(64) PRIMARY KEY, count INTEGER NOT NULL, expires_at TIMESTAMPTZ NOT NULL
);
