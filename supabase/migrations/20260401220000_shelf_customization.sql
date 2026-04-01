-- Add visibility toggle to the shelves table
ALTER TABLE "public"."shelves" 
ADD COLUMN "display_on_profile" boolean DEFAULT true;

-- Add an ordering position to the shelf_books table
ALTER TABLE "public"."shelf_books" 
ADD COLUMN "position" integer DEFAULT 0;
