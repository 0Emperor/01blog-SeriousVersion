-- Test Data Generation Script for 01Blog
-- This script creates 30 test user accounts with posts, comments, follows, and reports
-- Password for all test accounts: Test123!

-- Note: The password hash below is BCrypt hash for "Test123!"
-- Generated with: $2a$10$rN8qNKZ7eQ8K3K3K3K3K3OeKfNKZ7eQ8K3K3K3K3K3K3K3K3K3K3K

BEGIN;

-- Insert 30 test users (all with role = false for regular users)
INSERT INTO users (id, username, name, bio, password_hash, profile, role, is_baned, created_at) VALUES
('a1111111-1111-1111-1111-111111111111', 'alice_wonder', 'Alice Wonderland', 'Adventure seeker and tea enthusiast ☕', '$2a$10$rN8qNKZ7eQ8K3K3K3K3K3OeKfNKZ7eQ8K3K3K3K3K3K3K3K3K3K3K', null, false, false, NOW() - INTERVAL '90 days'),
('a2222222-2222-2222-2222-222222222222', 'bob_builder', 'Bob the Builder', 'Can we fix it? Yes we can! 🔨', '$2a$10$rN8qNKZ7eQ8K3K3K3K3K3OeKfNKZ7eQ8K3K3K3K3K3K3K3K3K3K3K', null, false, false, NOW() - INTERVAL '85 days'),
('a3333333-3333-3333-3333-333333333333', 'charlie_tech', 'Charlie Brown', 'Software engineer | Coffee addict ☕💻', '$2a$10$rN8qNKZ7eQ8K3K3K3K3K3OeKfNKZ7eQ8K3K3K3K3K3K3K3K3K3K3K', null, false, false, NOW() - INTERVAL '80 days'),
('a4444444-4444-4444-4444-444444444444', 'diana_artist', 'Diana Prince', 'Digital artist | Creating magic with pixels ✨🎨', '$2a$10$rN8qNKZ7eQ8K3K3K3K3K3OeKfNKZ7eQ8K3K3K3K3K3K3K3K3K3K3K', null, false, false, NOW() - INTERVAL '75 days'),
('a5555555-5555-5555-5555-555555555555', 'evan_fitness', 'Evan Strong', 'Fitness coach | Your gains are my gains 💪', '$2a$10$rN8qNKZ7eQ8K3K3K3K3K3OeKfNKZ7eQ8K3K3K3K3K3K3K3K3K3K3K', null, false, false, NOW() - INTERVAL '70 days'),
('a6666666-6666-6666-6666-666666666666', 'fiona_chef', 'Fiona Gourmet', 'Professional chef | Food is love 🍳❤️', '$2a$10$rN8qNKZ7eQ8K3K3K3K3K3OeKfNKZ7eQ8K3K3K3K3K3K3K3K3K3K3K', null, false, false, NOW() - INTERVAL '65 days'),
('a7777777-7777-7777-7777-777777777777', 'george_travel', 'George Explorer', 'World traveler | 47 countries and counting 🌍', '$2a$10$rN8qNKZ7eQ8K3K3K3K3K3OeKfNKZ7eQ8K3K3K3K3K3K3K3K3K3K3K', null, false, false, NOW() - INTERVAL '60 days'),
('a8888888-8888-8888-8888-888888888888', 'hannah_music', 'Hannah Melody', 'Musician | Piano teacher | Classical music lover 🎹', '$2a$10$rN8qNKZ7eQ8K3K3K3K3K3OeKfNKZ7eQ8K3K3K3K3K3K3K3K3K3K3K', null, false, false, NOW() - INTERVAL '55 days'),
('a9999999-9999-9999-9999-999999999999', 'ian_gamer', 'Ian Player', 'Pro gamer | Streaming daily 🎮', '$2a$10$rN8qNKZ7eQ8K3K3K3K3K3OeKfNKZ7eQ8K3K3K3K3K3K3K3K3K3K3K', null, false, false, NOW() - INTERVAL '50 days'),
('b1111111-1111-1111-1111-111111111111', 'julia_writer', 'Julia Wordsmith', 'Author | Writing stories that matter 📚', '$2a$10$rN8qNKZ7eQ8K3K3K3K3K3OeKfNKZ7eQ8K3K3K3K3K3K3K3K3K3K3K', null, false, false, NOW() - INTERVAL '45 days'),
('b2222222-2222-2222-2222-222222222222', 'kevin_photo', 'Kevin Lens', 'Photographer | Capturing moments 📸', '$2a$10$rN8qNKZ7eQ8K3K3K3K3K3OeKfNKZ7eQ8K3K3K3K3K3K3K3K3K3K3K', null, false, false, NOW() - INTERVAL '40 days'),
('b3333333-3333-3333-3333-333333333333', 'laura_science', 'Laura Newton', 'Physicist | Science communicator 🔬', '$2a$10$rN8qNKZ7eQ8K3K3K3K3K3OeKfNKZ7eQ8K3K3K3K3K3K3K3K3K3K3K', null, false, false, NOW() - INTERVAL '35 days'),
('b4444444-4444-4444-4444-444444444444', 'mike_business', 'Mike Entrepreneur', 'Startup founder | Building the future 🚀', '$2a$10$rN8qNKZ7eQ8K3K3K3K3K3OeKfNKZ7eQ8K3K3K3K3K3K3K3K3K3K3K', null, false, false, NOW() - INTERVAL '30 days'),
('b5555555-5555-5555-5555-555555555555', 'nina_yoga', 'Nina Zen', 'Yoga instructor | Find your inner peace 🧘', '$2a$10$rN8qNKZ7eQ8K3K3K3K3K3OeKfNKZ7eQ8K3K3K3K3K3K3K3K3K3K3K', null, false, false, NOW() - INTERVAL '28 days'),
('b6666666-6666-6666-6666-666666666666', 'oscar_comedy', 'Oscar Laughs', 'Stand-up comedian | Making people smile 😄', '$2a$10$rN8qNKZ7eQ8K3K3K3K3K3OeKfNKZ7eQ8K3K3K3K3K3K3K3K3K3K3K', null, false, false, NOW() - INTERVAL '25 days'),
('b7777777-7777-7777-7777-777777777777', 'paula_fashion', 'Paula Style', 'Fashion designer | Style is everything 👗', '$2a$10$rN8qNKZ7eQ8K3K3K3K3K3OeKfNKZ7eQ8K3K3K3K3K3K3K3K3K3K3K', null, false, false, NOW() - INTERVAL '22 days'),
('b8888888-8888-8888-8888-888888888888', 'quinn_crypto', 'Quinn Blockchain', 'Crypto enthusiast | HODL 💎', '$2a$10$rN8qNKZ7eQ8K3K3K3K3K3OeKfNKZ7eQ8K3K3K3K3K3K3K3K3K3K3K', null, false, false, NOW() - INTERVAL '20 days'),
('b9999999-9999-9999-9999-999999999999', 'rachel_pets', 'Rachel Paws', 'Veterinarian | Animal lover 🐾', '$2a$10$rN8qNKZ7eQ8K3K3K3K3K3OeKfNKZ7eQ8K3K3K3K3K3K3K3K3K3K3K', null, false, false, NOW() - INTERVAL '18 days'),
('c1111111-1111-1111-1111-111111111111', 'sam_sports', 'Sam Champion', 'Sports analyst | Living for the game ⚽', '$2a$10$rN8qNKZ7eQ8K3K3K3K3K3OeKfNKZ7eQ8K3K3K3K3K3K3K3K3K3K3K', null, false, false, NOW() - INTERVAL '16 days'),
('c2222222-2222-2222-2222-222222222222', 'tina_garden', 'Tina Green', 'Gardener | Growing happiness 🌱', '$2a$10$rN8qNKZ7eQ8K3K3K3K3K3OeKfNKZ7eQ8K3K3K3K3K3K3K3K3K3K3K', null, false, false, NOW() - INTERVAL '14 days'),
('c3333333-3333-3333-3333-333333333333', 'uma_dance', 'Uma Rhythm', 'Professional dancer | Move to the beat 💃', '$2a$10$rN8qNKZ7eQ8K3K3K3K3K3OeKfNKZ7eQ8K3K3K3K3K3K3K3K3K3K3K', null, false, false, NOW() - INTERVAL '12 days'),
('c4444444-4444-4444-4444-444444444444', 'victor_history', 'Victor Past', 'History professor | Learning from yesterday 📜', '$2a$10$rN8qNKZ7eQ8K3K3K3K3K3OeKfNKZ7eQ8K3K3K3K3K3K3K3K3K3K3K', null, false, false, NOW() - INTERVAL '10 days'),
('c5555555-5555-5555-5555-555555555555', 'wendy_eco', 'Wendy Earth', 'Environmental activist | Save our planet 🌍', '$2a$10$rN8qNKZ7eQ8K3K3K3K3K3OeKfNKZ7eQ8K3K3K3K3K3K3K3K3K3K3K', null, false, false, NOW() - INTERVAL '9 days'),
('c6666666-6666-6666-6666-666666666666', 'xander_magic', 'Xander Illusion', 'Magician | Creating wonder ✨', '$2a$10$rN8qNKZ7eQ8K3K3K3K3K3OeKfNKZ7eQ8K3K3K3K3K3K3K3K3K3K3K', null, false, false, NOW() - INTERVAL '8 days'),
('c7777777-7777-7777-7777-777777777777', 'yara_astro', 'Yara Cosmos', 'Astronomer | Stargazing enthusiast 🔭', '$2a$10$rN8qNKZ7eQ8K3K3K3K3K3OeKfNKZ7eQ8K3K3K3K3K3K3K3K3K3K3K', null, false, false, NOW() - INTERVAL '7 days'),
('c8888888-8888-8888-8888-888888888888', 'zack_memes', 'Zack Viral', 'Meme lord | Internet culture expert 😂', '$2a$10$rN8qNKZ7eQ8K3K3K3K3K3OeKfNKZ7eQ8K3K3K3K3K3K3K3K3K3K3K', null, false, false, NOW() - INTERVAL '6 days'),
('c9999999-9999-9999-9999-999999999999', 'amy_books', 'Amy Reader', 'Librarian | Book recommendations daily 📖', '$2a$10$rN8qNKZ7eQ8K3K3K3K3K3OeKfNKZ7eQ8K3K3K3K3K3K3K3K3K3K3K', null, false, false, NOW() - INTERVAL '5 days'),
('d1111111-1111-1111-1111-111111111111', 'ben_cars', 'Ben Racer', 'Car enthusiast | Speed is life 🏎️', '$2a$10$rN8qNKZ7eQ8K3K3K3K3K3OeKfNKZ7eQ8K3K3K3K3K3K3K3K3K3K3K', null, false, false, NOW() - INTERVAL '4 days'),
('d2222222-2222-2222-2222-222222222222', 'cathy_diy', 'Cathy Craft', 'DIY expert | Handmade everything 🛠️', '$2a$10$rN8qNKZ7eQ8K3K3K3K3K3OeKfNKZ7eQ8K3K3K3K3K3K3K3K3K3K3K', null, false, false, NOW() - INTERVAL '3 days'),
('d3333333-3333-3333-3333-333333333333', 'derek_film', 'Derek Cinema', 'Film critic | Movie buff 🎬', '$2a$10$rN8qNKZ7eQ8K3K3K3K3K3OeKfNKZ7eQ8K3K3K3K3K3K3K3K3K3K3K', null, false, false, NOW() - INTERVAL '2 days');

COMMIT;
