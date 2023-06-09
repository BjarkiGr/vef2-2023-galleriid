CREATE TABLE public.users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(64) NOT NULL UNIQUE,
  email VARCHAR(128) NOT NULL UNIQUE,
  password VARCHAR(256) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  admin BOOLEAN DEFAULT false
);

CREATE TABLE public.images (
  id SERIAL PRIMARY KEY,
  name VARCHAR(256) NOT NULL,
  data BYTEA NOT NULL,
  filesize BIGINT NOT NULL,
  user_id INTEGER REFERENCES public.users(id) NOT NULL,
  tags VARCHAR(256)[] NOT NULL DEFAULT '{}',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
