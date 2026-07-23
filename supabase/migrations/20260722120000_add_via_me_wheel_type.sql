-- Adiciona o tipo 'via-me' ao enum wheel_type
ALTER TYPE public.wheel_type ADD VALUE IF NOT EXISTS 'via-me';
