CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  -- 1. Create the user profile using metadata if provided, fallback to email prefix
  INSERT INTO public.profiles (id, username, first_name, last_name, avatar_url)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)), 
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    ''
  );

  -- 2. Create default shelves for the new user
  INSERT INTO public.shelves (user_id, name, is_default)
  VALUES 
    (NEW.id, 'Reading', true),
    (NEW.id, 'Read', true),
    (NEW.id, 'Want to Read', true),
    (NEW.id, 'Favorites', true);

  RETURN new;
END;
$$;
