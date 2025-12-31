CREATE TABLE `items` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`barcode` text,
	`category` text NOT NULL,
	`image_url` text,
	`status` text NOT NULL,
	`description` text,
	`tags` text,
	`list_price` integer,
	`purchase_price` integer,
	`created_at` integer NOT NULL
);
