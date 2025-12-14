-- ============================================
-- 01Blog Test Data Generation Script
-- ============================================
-- This script creates comprehensive test data for audit purposes
-- - 30 test user accounts (all regular users, not admin)
-- - Multiple posts per user with varied content
-- - Comments on posts
-- - Follow relationships (subscriptions)
-- - Sample reports
--
-- Password for ALL test accounts: Test123!
-- BCrypt hash: $2b$12$uIjQNyKClY9nkZmTwW6BCeAYG6IYiQWjpFRakC9g9MYmPEGbKolha
-- ============================================

BEGIN;

-- ============================================
-- 1. INSERT TEST USERS (30 accounts)
-- ============================================
INSERT INTO users (id, username, name, bio, password_hash, profile, role, is_baned, created_at) VALUES
('a1111111-1111-1111-1111-111111111111', 'alice_wonder', 'Alice Wonderland', 'Adventure seeker and tea enthusiast ☕', '$2b$12$uIjQNyKClY9nkZmTwW6BCeAYG6IYiQWjpFRakC9g9MYmPEGbKolha', null, false, false, NOW() - INTERVAL '90 days'),
('a2222222-2222-2222-2222-222222222222', 'bob_builder', 'Bob the Builder', 'Can we fix it? Yes we can! 🔨', '$2b$12$uIjQNyKClY9nkZmTwW6BCeAYG6IYiQWjpFRakC9g9MYmPEGbKolha', null, false, false, NOW() - INTERVAL '85 days'),
('a3333333-3333-3333-3333-333333333333', 'charlie_tech', 'Charlie Brown', 'Software engineer | Coffee addict ☕💻', '$2b$12$uIjQNyKClY9nkZmTwW6BCeAYG6IYiQWjpFRakC9g9MYmPEGbKolha', null, false, false, NOW() - INTERVAL '80 days'),
('a4444444-4444-4444-4444-444444444444', 'diana_artist', 'Diana Prince', 'Digital artist | Creating magic with pixels ✨🎨', '$2b$12$uIjQNyKClY9nkZmTwW6BCeAYG6IYiQWjpFRakC9g9MYmPEGbKolha', null, false, false, NOW() - INTERVAL '75 days'),
('a5555555-5555-5555-5555-555555555555', 'evan_fitness', 'Evan Strong', 'Fitness coach | Your gains are my gains 💪', '$2b$12$uIjQNyKClY9nkZmTwW6BCeAYG6IYiQWjpFRakC9g9MYmPEGbKolha', null, false, false, NOW() - INTERVAL '70 days'),
('a6666666-6666-6666-6666-666666666666', 'fiona_chef', 'Fiona Gourmet', 'Professional chef | Food is love 🍳❤️', '$2b$12$uIjQNyKClY9nkZmTwW6BCeAYG6IYiQWjpFRakC9g9MYmPEGbKolha', null, false, false, NOW() - INTERVAL '65 days'),
('a7777777-7777-7777-7777-777777777777', 'george_travel', 'George Explorer', 'World traveler | 47 countries and counting 🌍', '$2b$12$uIjQNyKClY9nkZmTwW6BCeAYG6IYiQWjpFRakC9g9MYmPEGbKolha', null, false, false, NOW() - INTERVAL '60 days'),
('a8888888-8888-8888-8888-888888888888', 'hannah_music', 'Hannah Melody', 'Musician | Piano teacher | Classical music lover 🎹', '$2b$12$uIjQNyKClY9nkZmTwW6BCeAYG6IYiQWjpFRakC9g9MYmPEGbKolha', null, false, false, NOW() - INTERVAL '55 days'),
('a9999999-9999-9999-9999-999999999999', 'ian_gamer', 'Ian Player', 'Pro gamer | Streaming daily 🎮', '$2b$12$uIjQNyKClY9nkZmTwW6BCeAYG6IYiQWjpFRakC9g9MYmPEGbKolha', null, false, false, NOW() - INTERVAL '50 days'),
('b1111111-1111-1111-1111-111111111111', 'julia_writer', 'Julia Wordsmith', 'Author | Writing stories that matter 📚', '$2b$12$uIjQNyKClY9nkZmTwW6BCeAYG6IYiQWjpFRakC9g9MYmPEGbKolha', null, false, false, NOW() - INTERVAL '45 days'),
('b2222222-2222-2222-2222-222222222222', 'kevin_photo', 'Kevin Lens', 'Photographer | Capturing moments 📸', '$2b$12$uIjQNyKClY9nkZmTwW6BCeAYG6IYiQWjpFRakC9g9MYmPEGbKolha', null, false, false, NOW() - INTERVAL '40 days'),
('b3333333-3333-3333-3333-333333333333', 'laura_science', 'Laura Newton', 'Physicist | Science communicator 🔬', '$2b$12$uIjQNyKClY9nkZmTwW6BCeAYG6IYiQWjpFRakC9g9MYmPEGbKolha', null, false, false, NOW() - INTERVAL '35 days'),
('b4444444-4444-4444-4444-444444444444', 'mike_business', 'Mike Entrepreneur', 'Startup founder | Building the future 🚀', '$2b$12$uIjQNyKClY9nkZmTwW6BCeAYG6IYiQWjpFRakC9g9MYmPEGbKolha', null, false, false, NOW() - INTERVAL '30 days'),
('b5555555-5555-5555-5555-555555555555', 'nina_yoga', 'Nina Zen', 'Yoga instructor | Find your inner peace 🧘', '$2b$12$uIjQNyKClY9nkZmTwW6BCeAYG6IYiQWjpFRakC9g9MYmPEGbKolha', null, false, false, NOW() - INTERVAL '28 days'),
('b6666666-6666-6666-6666-666666666666', 'oscar_comedy', 'Oscar Laughs', 'Stand-up comedian | Making people smile 😄', '$2b$12$uIjQNyKClY9nkZmTwW6BCeAYG6IYiQWjpFRakC9g9MYmPEGbKolha', null, false, false, NOW() - INTERVAL '25 days'),
('b7777777-7777-7777-7777-777777777777', 'paula_fashion', 'Paula Style', 'Fashion designer | Style is everything 👗', '$2b$12$uIjQNyKClY9nkZmTwW6BCeAYG6IYiQWjpFRakC9g9MYmPEGbKolha', null, false, false, NOW() - INTERVAL '22 days'),
('b8888888-8888-8888-8888-888888888888', 'quinn_crypto', 'Quinn Blockchain', 'Crypto enthusiast | HODL 💎', '$2b$12$uIjQNyKClY9nkZmTwW6BCeAYG6IYiQWjpFRakC9g9MYmPEGbKolha', null, false, false, NOW() - INTERVAL '20 days'),
('b9999999-9999-9999-9999-999999999999', 'rachel_pets', 'Rachel Paws', 'Veterinarian | Animal lover 🐾', '$2b$12$uIjQNyKClY9nkZmTwW6BCeAYG6IYiQWjpFRakC9g9MYmPEGbKolha', null, false, false, NOW() - INTERVAL '18 days'),
('c1111111-1111-1111-1111-111111111111', 'sam_sports', 'Sam Champion', 'Sports analyst | Living for the game ⚽', '$2b$12$uIjQNyKClY9nkZmTwW6BCeAYG6IYiQWjpFRakC9g9MYmPEGbKolha', null, false, false, NOW() - INTERVAL '16 days'),
('c2222222-2222-2222-2222-222222222222', 'tina_garden', 'Tina Green', 'Gardener | Growing happiness 🌱', '$2b$12$uIjQNyKClY9nkZmTwW6BCeAYG6IYiQWjpFRakC9g9MYmPEGbKolha', null, false, false, NOW() - INTERVAL '14 days'),
('c3333333-3333-3333-3333-333333333333', 'uma_dance', 'Uma Rhythm', 'Professional dancer | Move to the beat 💃', '$2b$12$uIjQNyKClY9nkZmTwW6BCeAYG6IYiQWjpFRakC9g9MYmPEGbKolha', null, false, false, NOW() - INTERVAL '12 days'),
('c4444444-4444-4444-4444-444444444444', 'victor_history', 'Victor Past', 'History professor | Learning from yesterday 📜', '$2b$12$uIjQNyKClY9nkZmTwW6BCeAYG6IYiQWjpFRakC9g9MYmPEGbKolha', null, false, false, NOW() - INTERVAL '10 days'),
('c5555555-5555-5555-5555-555555555555', 'wendy_eco', 'Wendy Earth', 'Environmental activist | Save our planet 🌍', '$2b$12$uIjQNyKClY9nkZmTwW6BCeAYG6IYiQWjpFRakC9g9MYmPEGbKolha', null, false, false, NOW() - INTERVAL '9 days'),
('c6666666-6666-6666-6666-666666666666', 'xander_magic', 'Xander Illusion', 'Magician | Creating wonder ✨', '$2b$12$uIjQNyKClY9nkZmTwW6BCeAYG6IYiQWjpFRakC9g9MYmPEGbKolha', null, false, false, NOW() - INTERVAL '8 days'),
('c7777777-7777-7777-7777-777777777777', 'yara_astro', 'Yara Cosmos', 'Astronomer | Stargazing enthusiast 🔭', '$2b$12$uIjQNyKClY9nkZmTwW6BCeAYG6IYiQWjpFRakC9g9MYmPEGbKolha', null, false, false, NOW() - INTERVAL '7 days'),
('c8888888-8888-8888-8888-888888888888', 'zack_memes', 'Zack Viral', 'Meme lord | Internet culture expert 😂', '$2b$12$uIjQNyKClY9nkZmTwW6BCeAYG6IYiQWjpFRakC9g9MYmPEGbKolha', null, false, false, NOW() - INTERVAL '6 days'),
('c9999999-9999-9999-9999-999999999999', 'amy_books', 'Amy Reader', 'Librarian | Book recommendations daily 📖', '$2b$12$uIjQNyKClY9nkZmTwW6BCeAYG6IYiQWjpFRakC9g9MYmPEGbKolha', null, false, false, NOW() - INTERVAL '5 days'),
('d1111111-1111-1111-1111-111111111111', 'ben_cars', 'Ben Racer', 'Car enthusiast | Speed is life 🏎️', '$2b$12$uIjQNyKClY9nkZmTwW6BCeAYG6IYiQWjpFRakC9g9MYmPEGbKolha', null, false, false, NOW() - INTERVAL '4 days'),
('d2222222-2222-2222-2222-222222222222', 'cathy_diy', 'Cathy Craft', 'DIY expert | Handmade everything 🛠️', '$2b$12$uIjQNyKClY9nkZmTwW6BCeAYG6IYiQWjpFRakC9g9MYmPEGbKolha', null, false, false, NOW() - INTERVAL '3 days'),
('d3333333-3333-3333-3333-333333333333', 'derek_film', 'Derek Cinema', 'Film critic | Movie buff 🎬', '$2b$12$uIjQNyKClY9nkZmTwW6BCeAYG6IYiQWjpFRakC9g9MYmPEGbKolha', null, false, false, NOW() - INTERVAL '2 days');

-- ============================================
-- 2. INSERT POSTS (60+ posts from various users)
-- ============================================
INSERT INTO posts (title, description, user_id, hidden, created_at) VALUES
-- Alice's posts
('My Tea Collection', 'Just added a rare Darjeeling to my collection! The aroma is absolutely divine. Anyone else into premium teas? ☕', 'a1111111-1111-1111-1111-111111111111', false, NOW() - INTERVAL '5 days'),
('Wonderland Adventures', 'Exploring the local botanical gardens today. Found the most amazing rabbit-shaped topiary! 🐰🌿', 'a1111111-1111-1111-1111-111111111111', false, NOW() - INTERVAL '15 days'),

-- Bob's posts
('DIY Home Renovation', 'Finally finished renovating the kitchen! Took 3 months but it was worth it. Before and after pics coming soon! 🔨', 'a2222222-2222-2222-2222-222222222222', false, NOW() - INTERVAL '3 days'),
('Tool Review', 'Just got the new DeWalt cordless drill. This thing is a beast! Perfect for heavy-duty projects. 10/10 recommend.', 'a2222222-2222-2222-2222-222222222222', false, NOW() - INTERVAL '12 days'),

-- Charlie's posts
('New Framework Released', 'Just tried out the latest version of React 19. The new compiler is mind-blowing! 🚀', 'a3333333-3333-3333-3333-333333333333', false, NOW() - INTERVAL '2 days'),
('Coffee Setup', 'My home office coffee station is complete. Pour-over, espresso machine, and a grinder. Productivity level: 9000 ☕💻', 'a3333333-3333-3333-3333-333333333333', false, NOW() - INTERVAL '8 days'),
('Debugging Tips', 'Pro tip: Always console.log your assumptions. You''d be surprised how often they''re wrong! 😅', 'a3333333-3333-3333-3333-333333333333', false, NOW() - INTERVAL '20 days'),

-- Diana's posts
('Digital Art Process', 'Working on a new fantasy landscape. Here''s my process from sketch to final render. Took about 15 hours! ✨🎨', 'a4444444-4444-4444-4444-444444444444', false, NOW() - INTERVAL '1 day'),
('Pixel Art Tutorial', 'Created a quick tutorial on pixel art animation. Link in bio! Perfect for beginners.', 'a4444444-4444-4444-4444-444444444444', false, NOW() - INTERVAL '10 days'),

-- Evan's posts
('Morning Workout', 'Crushed leg day today! 💪 Remember: consistency beats intensity. Show up every day!', 'a5555555-5555-5555-5555-555555555555', false, NOW() - INTERVAL '1 day'),
('Nutrition Guide', 'Your gains are made in the kitchen, not just the gym. Here''s my meal prep for the week. High protein, balanced macros!', 'a5555555-5555-5555-5555-555555555555', false, NOW() - INTERVAL '7 days'),
('Fitness Motivation', 'One year transformation update! Same person, different mindset. You can do this! 🔥', 'a5555555-5555-5555-5555-555555555555', false, NOW() - INTERVAL '14 days'),

-- Fiona's posts
('French Cuisine', 'Perfected my coq au vin recipe! The secret is in the wine reduction. Recipe coming to my blog soon! 🍷🍗', 'a6666666-6666-6666-6666-666666666666', false, NOW() - INTERVAL '2 days'),
('Baking Bread', 'Nothing beats the smell of fresh sourdough in the morning. This batch turned out perfect! 🥖', 'a6666666-6666-6666-6666-666666666666', false, NOW() - INTERVAL '9 days'),

-- George's posts
('Tokyo Travel', 'Just arrived in Tokyo! The energy here is incredible. Already found 3 amazing ramen spots. 🍜🇯🇵', 'a7777777-7777-7777-7777-777777777777', false, NOW() - INTERVAL '4 days'),
('Travel Tips', 'My top 10 travel hacks for budget backpacking. Number 7 will save you hundreds! 🎒', 'a7777777-7777-7777-7777-777777777777', false, NOW() - INTERVAL '11 days'),
('Country #47', 'Made it to Iceland! That makes 47 countries visited. The Northern Lights are on my bucket list! 🌍', 'a7777777-7777-7777-7777-777777777777', false, NOW() - INTERVAL '25 days'),

-- Hannah's posts
('Piano Recital', 'My students performed Chopin today. So proud of their progress! Music education matters. 🎹❤️', 'a8888888-8888-8888-8888-888888888888', false, NOW() - INTERVAL '3 days'),
('Classical Music', 'Listening to Rachmaninoff''s Piano Concerto No. 2. Still gives me chills every time. Pure genius!', 'a8888888-8888-8888-8888-888888888888', false, NOW() - INTERVAL '13 days'),

-- Ian's posts
('Tournament Win', 'WE WON THE TOURNAMENT! 🏆 Thanks to everyone who watched the stream. GG to all opponents!', 'a9999999-9999-9999-9999-999999999999', false, NOW() - INTERVAL '1 day'),
('Gaming Setup', 'New gaming chair arrived! My back thanks me already. Setup tour coming this weekend! 🎮', 'a9999999-9999-9999-9999-999999999999', false, NOW() - INTERVAL '6 days'),
('Game Review', 'Just finished the new RPG everyone''s talking about. 9/10 - amazing story, minor bugs. Full review on stream tonight!', 'a9999999-9999-9999-9999-999999999999', false, NOW() - INTERVAL '15 days'),

-- Julia's posts
('New Book Release', 'My new novel drops next month! Pre-orders are live. This one''s close to my heart. 📚❤️', 'b1111111-1111-1111-1111-111111111111', false, NOW() - INTERVAL '5 days'),
('Writing Process', 'Writer''s block is real, but so is writer''s flow. Today was a 5000-word day! ✍️', 'b1111111-1111-1111-1111-111111111111', false, NOW() - INTERVAL '12 days'),

-- Kevin's posts
('Golden Hour', 'Caught the perfect golden hour shot today. Nature is the best artist. 📸🌅', 'b2222222-2222-2222-2222-222222222222', false, NOW() - INTERVAL '2 days'),
('Photography Tips', 'Understanding the exposure triangle changed my photography game. Here''s a simple guide for beginners!', 'b2222222-2222-2222-2222-222222222222', false, NOW() - INTERVAL '10 days'),

-- Laura's posts
('Quantum Physics', 'Explaining quantum entanglement to my students today. Their minds = blown 🤯🔬', 'b3333333-3333-3333-3333-333333333333', false, NOW() - INTERVAL '3 days'),
('Science Communication', 'Why we need more scientists on social media. Making science accessible is crucial for society!', 'b3333333-3333-3333-3333-333333333333', false, NOW() - INTERVAL '14 days'),

-- Mike's posts
('Startup Journey', 'Just closed our Series A funding! 🚀 Couldn''t have done it without my amazing team. Here''s what we learned...', 'b4444444-4444-4444-4444-444444444444', false, NOW() - INTERVAL '4 days'),
('Business Advice', 'The best business advice I ever got: Focus on solving real problems, not chasing trends.', 'b4444444-4444-4444-4444-444444444444', false, NOW() - INTERVAL '11 days'),

-- Nina's posts
('Yoga Practice', 'Morning yoga session by the beach. Finding peace in movement. 🧘‍♀️🌊', 'b5555555-5555-5555-5555-555555555555', false, NOW() - INTERVAL '1 day'),
('Meditation Guide', 'New to meditation? Start with just 5 minutes a day. Consistency is key to inner peace.', 'b5555555-5555-5555-5555-555555555555', false, NOW() - INTERVAL '8 days'),

-- Oscar's posts
('Comedy Show', 'Sold out show last night! Thanks to everyone who came. Your laughter fuels my soul! 😄🎤', 'b6666666-6666-6666-6666-666666666666', false, NOW() - INTERVAL '2 days'),
('Joke Writing', 'The secret to good comedy? Timing. And also having good jokes. Mostly timing though. 😂', 'b6666666-6666-6666-6666-666666666666', false, NOW() - INTERVAL '13 days'),

-- Paula's posts
('Fashion Week', 'Paris Fashion Week was incredible! So much inspiration. New collection dropping soon! 👗✨', 'b7777777-7777-7777-7777-777777777777', false, NOW() - INTERVAL '3 days'),
('Style Tips', 'Fashion rule #1: Wear what makes YOU feel confident. Trends come and go, confidence is eternal.', 'b7777777-7777-7777-7777-777777777777', false, NOW() - INTERVAL '16 days'),

-- Quinn's posts
('Crypto Market', 'Bitcoin breaking resistance! HODL strong everyone. Not financial advice! 💎🙌', 'b8888888-8888-8888-8888-888888888888', false, NOW() - INTERVAL '1 day'),
('Blockchain Tech', 'The real revolution isn''t crypto prices, it''s the technology. Decentralization is the future!', 'b8888888-8888-8888-8888-888888888888', false, NOW() - INTERVAL '9 days'),

-- Rachel's posts
('Veterinary Care', 'Saved a puppy today! Reminder: regular checkups are essential for your pets'' health. 🐾❤️', 'b9999999-9999-9999-9999-999999999999', false, NOW() - INTERVAL '2 days'),
('Pet Adoption', 'Meet Luna! She''s looking for her forever home. Adopt, don''t shop! 🐕', 'b9999999-9999-9999-9999-999999999999', false, NOW() - INTERVAL '12 days'),

-- Sam's posts
('Game Analysis', 'That last-minute goal was insane! ⚽ Full match analysis coming to my channel tonight.', 'c1111111-1111-1111-1111-111111111111', false, NOW() - INTERVAL '1 day'),
('Sports Commentary', 'Why this season is the most competitive in years. The stats don''t lie!', 'c1111111-1111-1111-1111-111111111111', false, NOW() - INTERVAL '7 days'),

-- Tina's posts
('Garden Update', 'My tomatoes are finally ripening! Nothing beats homegrown vegetables. 🍅🌱', 'c2222222-2222-2222-2222-222222222222', false, NOW() - INTERVAL '3 days'),
('Gardening Tips', 'Composting 101: Turn your kitchen scraps into black gold for your garden!', 'c2222222-2222-2222-2222-222222222222', false, NOW() - INTERVAL '15 days'),

-- Uma's posts
('Dance Performance', 'Opening night was magical! Thank you to everyone who came to support. More shows this weekend! 💃✨', 'c3333333-3333-3333-3333-333333333333', false, NOW() - INTERVAL '2 days'),
('Dance Tutorial', 'New contemporary dance tutorial up on my channel. Perfect for intermediate dancers!', 'c3333333-3333-3333-3333-333333333333', false, NOW() - INTERVAL '11 days'),

-- Victor's posts
('History Lesson', 'Teaching about the Renaissance today. The parallels to our current era are fascinating! 📜', 'c4444444-4444-4444-4444-444444444444', false, NOW() - INTERVAL '4 days'),
('Historical Facts', 'Did you know? The Library of Alexandria had over 400,000 scrolls. Imagine the knowledge lost!', 'c4444444-4444-4444-4444-444444444444', false, NOW() - INTERVAL '13 days'),

-- Wendy's posts
('Climate Action', 'Joined the beach cleanup today. Collected 50kg of plastic! Every action counts. 🌍♻️', 'c5555555-5555-5555-5555-555555555555', false, NOW() - INTERVAL '1 day'),
('Eco Tips', 'Simple ways to reduce your carbon footprint: Start with reusable bags and bottles!', 'c5555555-5555-5555-5555-555555555555', false, NOW() - INTERVAL '9 days'),

-- Xander's posts
('Magic Show', 'Performed at a kid''s birthday party today. Their faces when the rabbit appeared = priceless! ✨🐰', 'c6666666-6666-6666-6666-666666666666', false, NOW() - INTERVAL '2 days'),
('Magic Tutorial', 'Learn your first card trick! This one always amazes people. Practice makes perfect!', 'c6666666-6666-6666-6666-666666666666', false, NOW() - INTERVAL '14 days'),

-- Yara's posts
('Stargazing', 'Clear skies tonight! Spotted Jupiter and Saturn. The universe is breathtaking. 🔭⭐', 'c7777777-7777-7777-7777-777777777777', false, NOW() - INTERVAL '1 day'),
('Astronomy Facts', 'Fun fact: There are more stars in the universe than grains of sand on all Earth''s beaches! 🌌', 'c7777777-7777-7777-7777-777777777777', false, NOW() - INTERVAL '10 days'),

-- Zack's posts
('Meme Review', 'This week''s top memes ranked. Number 3 had me crying! 😂', 'c8888888-8888-8888-8888-888888888888', false, NOW() - INTERVAL '1 day'),
('Internet Culture', 'The evolution of memes from 2010 to now. A thread 🧵', 'c8888888-8888-8888-8888-888888888888', false, NOW() - INTERVAL '8 days'),

-- Amy's posts
('Book Recommendation', 'Just finished "The Midnight Library". Absolutely stunning! 5/5 stars. 📖⭐', 'c9999999-9999-9999-9999-999999999999', false, NOW() - INTERVAL '2 days'),
('Reading Challenge', 'Halfway through my 100-book challenge! Current count: 52. What are you reading?', 'c9999999-9999-9999-9999-999999999999', false, NOW() - INTERVAL '12 days'),

-- Ben's posts
('Car Meet', 'Amazing car meet today! Saw some rare classics. That ''67 Mustang though! 🏎️', 'd1111111-1111-1111-1111-111111111111', false, NOW() - INTERVAL '1 day'),
('Car Maintenance', 'DIY oil change guide. Save money and learn about your car! Tutorial in comments.', 'd1111111-1111-1111-1111-111111111111', false, NOW() - INTERVAL '9 days'),

-- Cathy's posts
('DIY Project', 'Made a coffee table from reclaimed wood! Total cost: $30. Tutorial coming soon! 🛠️', 'd2222222-2222-2222-2222-222222222222', false, NOW() - INTERVAL '3 days'),
('Craft Ideas', 'Upcycling old jeans into a tote bag. Sustainable fashion at its best! ♻️', 'd2222222-2222-2222-2222-222222222222', false, NOW() - INTERVAL '11 days'),

-- Derek's posts
('Movie Review', 'Just watched the new sci-fi thriller. Cinematography: 10/10. Plot: 7/10. Full review on my blog! 🎬', 'd3333333-3333-3333-3333-333333333333', false, NOW() - INTERVAL '1 day'),
('Film Analysis', 'Why practical effects > CGI. A deep dive into classic filmmaking techniques.', 'd3333333-3333-3333-3333-333333333333', false, NOW() - INTERVAL '8 days');

COMMIT;

BEGIN;

-- ============================================
-- 3. INSERT COMMENTS (100+ comments on various posts)
-- ============================================
-- Comments on Alice's tea post (post_id will be 1)
INSERT INTO comments (text, post_id, user_id, created_at) VALUES
('I love Darjeeling! Have you tried the first flush?', 1, 'a6666666-6666-6666-6666-666666666666', NOW() - INTERVAL '4 days'),
('Tea enthusiast here! Would love to know where you got it.', 1, 'a8888888-8888-8888-8888-888888888888', NOW() - INTERVAL '4 days'),
('Nothing beats a good cup of tea ☕', 1, 'b1111111-1111-1111-1111-111111111111', NOW() - INTERVAL '3 days'),

-- Comments on Bob's renovation post
('This looks amazing! How much did it cost?', 3, 'a1111111-1111-1111-1111-111111111111', NOW() - INTERVAL '2 days'),
('Great work! I need to renovate my kitchen too.', 3, 'd2222222-2222-2222-2222-222222222222', NOW() - INTERVAL '2 days'),
('Can''t wait to see the before/after pics!', 3, 'a5555555-5555-5555-5555-555555555555', NOW() - INTERVAL '1 day'),

-- Comments on Charlie's React post
('React 19 is a game changer! The compiler is insane.', 5, 'b4444444-4444-4444-4444-444444444444', NOW() - INTERVAL '1 day'),
('Have you tried the new hooks yet?', 5, 'a3333333-3333-3333-3333-333333333333', NOW() - INTERVAL '1 day'),
('Migrating my project this weekend!', 5, 'a4444444-4444-4444-4444-444444444444', NOW() - INTERVAL '12 hours'),

-- Comments on Diana's art post
('This is absolutely stunning! 😍', 8, 'b7777777-7777-7777-7777-777777777777', NOW() - INTERVAL '12 hours'),
('Your art always amazes me!', 8, 'a1111111-1111-1111-1111-111111111111', NOW() - INTERVAL '8 hours'),
('What software do you use?', 8, 'a4444444-4444-4444-4444-444444444444', NOW() - INTERVAL '6 hours'),
('The lighting in this is perfect!', 8, 'b2222222-2222-2222-2222-222222222222', NOW() - INTERVAL '4 hours'),

-- Comments on Evan's workout post
('Leg day is the best day! 💪', 10, 'a5555555-5555-5555-5555-555555555555', NOW() - INTERVAL '12 hours'),
('What''s your routine?', 10, 'c1111111-1111-1111-1111-111111111111', NOW() - INTERVAL '10 hours'),
('Consistency is key! Great advice.', 10, 'b5555555-5555-5555-5555-555555555555', NOW() - INTERVAL '8 hours'),

-- Comments on George's Tokyo post
('Tokyo is on my bucket list!', 15, 'a7777777-7777-7777-7777-777777777777', NOW() - INTERVAL '3 days'),
('Which ramen spot was your favorite?', 15, 'a6666666-6666-6666-6666-666666666666', NOW() - INTERVAL '3 days'),
('I was there last year! Amazing city.', 15, 'b1111111-1111-1111-1111-111111111111', NOW() - INTERVAL '2 days'),
('Share more photos please!', 15, 'a4444444-4444-4444-4444-444444444444', NOW() - INTERVAL '2 days'),

-- Comments on Ian's tournament win
('Congrats! Well deserved! 🏆', 19, 'a9999999-9999-9999-9999-999999999999', NOW() - INTERVAL '12 hours'),
('Watched the whole thing! Epic plays!', 19, 'c8888888-8888-8888-8888-888888888888', NOW() - INTERVAL '10 hours'),
('GG! You played amazing!', 19, 'a3333333-3333-3333-3333-333333333333', NOW() - INTERVAL '8 hours'),

-- Comments on Julia's book release
('Pre-ordered! Can''t wait to read it! 📚', 22, 'c9999999-9999-9999-9999-999999999999', NOW() - INTERVAL '4 days'),
('Your last book was amazing!', 22, 'a1111111-1111-1111-1111-111111111111', NOW() - INTERVAL '4 days'),
('What genre is it?', 22, 'b1111111-1111-1111-1111-111111111111', NOW() - INTERVAL '3 days'),

-- Comments on Kevin's golden hour photo
('Incredible shot! 📸', 24, 'b2222222-2222-2222-2222-222222222222', NOW() - INTERVAL '1 day'),
('The colors are perfect!', 24, 'a4444444-4444-4444-4444-444444444444', NOW() - INTERVAL '1 day'),
('What camera do you use?', 24, 'a1111111-1111-1111-1111-111111111111', NOW() - INTERVAL '12 hours'),

-- Comments on Mike's startup post
('Congratulations! Huge milestone! 🚀', 28, 'b4444444-4444-4444-4444-444444444444', NOW() - INTERVAL '3 days'),
('This is inspiring!', 28, 'a3333333-3333-3333-3333-333333333333', NOW() - INTERVAL '3 days'),
('Would love to hear more about your journey!', 28, 'b8888888-8888-8888-8888-888888888888', NOW() - INTERVAL '2 days'),

-- Comments on Nina's yoga post
('This looks so peaceful! 🧘', 30, 'b5555555-5555-5555-5555-555555555555', NOW() - INTERVAL '12 hours'),
('Where is this beach?', 30, 'a7777777-7777-7777-7777-777777777777', NOW() - INTERVAL '10 hours'),
('Starting yoga next week!', 30, 'c3333333-3333-3333-3333-333333333333', NOW() - INTERVAL '8 hours'),

-- Comments on Oscar's comedy show
('Best show ever! 😂', 32, 'b6666666-6666-6666-6666-666666666666', NOW() - INTERVAL '1 day'),
('You killed it last night!', 32, 'a1111111-1111-1111-1111-111111111111', NOW() - INTERVAL '1 day'),
('When''s the next show?', 32, 'c8888888-8888-8888-8888-888888888888', NOW() - INTERVAL '12 hours'),

-- Comments on Quinn's crypto post
('HODL! 💎', 36, 'b8888888-8888-8888-8888-888888888888', NOW() - INTERVAL '12 hours'),
('To the moon! 🚀', 36, 'a3333333-3333-3333-3333-333333333333', NOW() - INTERVAL '10 hours'),
('What''s your price target?', 36, 'b4444444-4444-4444-4444-444444444444', NOW() - INTERVAL '8 hours'),

-- Comments on Rachel's puppy post
('Saved a life! You''re a hero! 🐾', 38, 'b9999999-9999-9999-9999-999999999999', NOW() - INTERVAL '1 day'),
('This made my day! ❤️', 38, 'a1111111-1111-1111-1111-111111111111', NOW() - INTERVAL '1 day'),
('Regular checkups are so important!', 38, 'c2222222-2222-2222-2222-222222222222', NOW() - INTERVAL '12 hours'),

-- Comments on Wendy's beach cleanup
('Thank you for doing this! 🌍', 50, 'c5555555-5555-5555-5555-555555555555', NOW() - INTERVAL '12 hours'),
('Every action counts! ♻️', 50, 'a7777777-7777-7777-7777-777777777777', NOW() - INTERVAL '10 hours'),
('Joining the next cleanup!', 50, 'c2222222-2222-2222-2222-222222222222', NOW() - INTERVAL '8 hours'),

-- Comments on Zack's meme review
('Number 3 was hilarious! 😂', 54, 'c8888888-8888-8888-8888-888888888888', NOW() - INTERVAL '12 hours'),
('Meme culture is evolving so fast!', 54, 'a9999999-9999-9999-9999-999999999999', NOW() - INTERVAL '10 hours'),
('I need more meme content!', 54, 'a1111111-1111-1111-1111-111111111111', NOW() - INTERVAL '8 hours'),

-- Comments on Amy's book recommendation
('Added to my reading list! 📖', 56, 'c9999999-9999-9999-9999-999999999999', NOW() - INTERVAL '1 day'),
('I loved that book too!', 56, 'b1111111-1111-1111-1111-111111111111', NOW() - INTERVAL '1 day'),
('Your recommendations are always spot on!', 56, 'a1111111-1111-1111-1111-111111111111', NOW() - INTERVAL '12 hours'),

-- Comments on Derek's movie review
('Great review! Watching it tonight! 🎬', 60, 'd3333333-3333-3333-3333-333333333333', NOW() - INTERVAL '12 hours'),
('I agree about the cinematography!', 60, 'a4444444-4444-4444-4444-444444444444', NOW() - INTERVAL '10 hours'),
('Your reviews are always helpful!', 60, 'b1111111-1111-1111-1111-111111111111', NOW() - INTERVAL '8 hours');

-- ============================================
-- 4. INSERT SUBSCRIPTIONS (Follow relationships)
-- ============================================
-- Create a network of follows (each user follows 5-15 others)
INSERT INTO subscriptions (subscriber_id, subscribed_to_id, created_at) VALUES
-- Alice follows
('a1111111-1111-1111-1111-111111111111', 'a6666666-6666-6666-6666-666666666666', NOW() - INTERVAL '80 days'),
('a1111111-1111-1111-1111-111111111111', 'a7777777-7777-7777-7777-777777777777', NOW() - INTERVAL '75 days'),
('a1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', NOW() - INTERVAL '70 days'),
('a1111111-1111-1111-1111-111111111111', 'b2222222-2222-2222-2222-222222222222', NOW() - INTERVAL '65 days'),
('a1111111-1111-1111-1111-111111111111', 'c9999999-9999-9999-9999-999999999999', NOW() - INTERVAL '60 days'),
('a1111111-1111-1111-1111-111111111111', 'a4444444-4444-4444-4444-444444444444', NOW() - INTERVAL '55 days'),
('a1111111-1111-1111-1111-111111111111', 'b6666666-6666-6666-6666-666666666666', NOW() - INTERVAL '50 days'),

-- Bob follows
('a2222222-2222-2222-2222-222222222222', 'a3333333-3333-3333-3333-333333333333', NOW() - INTERVAL '80 days'),
('a2222222-2222-2222-2222-222222222222', 'd2222222-2222-2222-2222-222222222222', NOW() - INTERVAL '75 days'),
('a2222222-2222-2222-2222-222222222222', 'a5555555-5555-5555-5555-555555555555', NOW() - INTERVAL '70 days'),
('a2222222-2222-2222-2222-222222222222', 'd1111111-1111-1111-1111-111111111111', NOW() - INTERVAL '65 days'),
('a2222222-2222-2222-2222-222222222222', 'b4444444-4444-4444-4444-444444444444', NOW() - INTERVAL '60 days'),

-- Charlie follows
('a3333333-3333-3333-3333-333333333333', 'a2222222-2222-2222-2222-222222222222', NOW() - INTERVAL '75 days'),
('a3333333-3333-3333-3333-333333333333', 'b4444444-4444-4444-4444-444444444444', NOW() - INTERVAL '70 days'),
('a3333333-3333-3333-3333-333333333333', 'b8888888-8888-8888-8888-888888888888', NOW() - INTERVAL '65 days'),
('a3333333-3333-3333-3333-333333333333', 'a4444444-4444-4444-4444-444444444444', NOW() - INTERVAL '60 days'),
('a3333333-3333-3333-3333-333333333333', 'b3333333-3333-3333-3333-333333333333', NOW() - INTERVAL '55 days'),
('a3333333-3333-3333-3333-333333333333', 'a9999999-9999-9999-9999-999999999999', NOW() - INTERVAL '50 days'),

-- Diana follows
('a4444444-4444-4444-4444-444444444444', 'a1111111-1111-1111-1111-111111111111', NOW() - INTERVAL '70 days'),
('a4444444-4444-4444-4444-444444444444', 'b2222222-2222-2222-2222-222222222222', NOW() - INTERVAL '65 days'),
('a4444444-4444-4444-4444-444444444444', 'b7777777-7777-7777-7777-777777777777', NOW() - INTERVAL '60 days'),
('a4444444-4444-4444-4444-444444444444', 'c3333333-3333-3333-3333-333333333333', NOW() - INTERVAL '55 days'),
('a4444444-4444-4444-4444-444444444444', 'd3333333-3333-3333-3333-333333333333', NOW() - INTERVAL '50 days'),
('a4444444-4444-4444-4444-444444444444', 'a3333333-3333-3333-3333-333333333333', NOW() - INTERVAL '45 days'),
('a4444444-4444-4444-4444-444444444444', 'c6666666-6666-6666-6666-666666666666', NOW() - INTERVAL '40 days'),

-- Evan follows
('a5555555-5555-5555-5555-555555555555', 'b5555555-5555-5555-5555-555555555555', NOW() - INTERVAL '65 days'),
('a5555555-5555-5555-5555-555555555555', 'c1111111-1111-1111-1111-111111111111', NOW() - INTERVAL '60 days'),
('a5555555-5555-5555-5555-555555555555', 'a6666666-6666-6666-6666-666666666666', NOW() - INTERVAL '55 days'),
('a5555555-5555-5555-5555-555555555555', 'c2222222-2222-2222-2222-222222222222', NOW() - INTERVAL '50 days'),
('a5555555-5555-5555-5555-555555555555', 'b9999999-9999-9999-9999-999999999999', NOW() - INTERVAL '45 days'),

-- Fiona follows
('a6666666-6666-6666-6666-666666666666', 'a1111111-1111-1111-1111-111111111111', NOW() - INTERVAL '60 days'),
('a6666666-6666-6666-6666-666666666666', 'a5555555-5555-5555-5555-555555555555', NOW() - INTERVAL '55 days'),
('a6666666-6666-6666-6666-666666666666', 'c2222222-2222-2222-2222-222222222222', NOW() - INTERVAL '50 days'),
('a6666666-6666-6666-6666-666666666666', 'b7777777-7777-7777-7777-777777777777', NOW() - INTERVAL '45 days'),
('a6666666-6666-6666-6666-666666666666', 'd2222222-2222-2222-2222-222222222222', NOW() - INTERVAL '40 days'),
('a6666666-6666-6666-6666-666666666666', 'a7777777-7777-7777-7777-777777777777', NOW() - INTERVAL '35 days'),

-- George follows
('a7777777-7777-7777-7777-777777777777', 'a1111111-1111-1111-1111-111111111111', NOW() - INTERVAL '55 days'),
('a7777777-7777-7777-7777-777777777777', 'a6666666-6666-6666-6666-666666666666', NOW() - INTERVAL '50 days'),
('a7777777-7777-7777-7777-777777777777', 'b2222222-2222-2222-2222-222222222222', NOW() - INTERVAL '45 days'),
('a7777777-7777-7777-7777-777777777777', 'c7777777-7777-7777-7777-777777777777', NOW() - INTERVAL '40 days'),
('a7777777-7777-7777-7777-777777777777', 'c5555555-5555-5555-5555-555555555555', NOW() - INTERVAL '35 days'),
('a7777777-7777-7777-7777-777777777777', 'a4444444-4444-4444-4444-444444444444', NOW() - INTERVAL '30 days'),
('a7777777-7777-7777-7777-777777777777', 'd3333333-3333-3333-3333-333333333333', NOW() - INTERVAL '25 days'),

-- Hannah follows
('a8888888-8888-8888-8888-888888888888', 'a1111111-1111-1111-1111-111111111111', NOW() - INTERVAL '50 days'),
('a8888888-8888-8888-8888-888888888888', 'b1111111-1111-1111-1111-111111111111', NOW() - INTERVAL '45 days'),
('a8888888-8888-8888-8888-888888888888', 'c3333333-3333-3333-3333-333333333333', NOW() - INTERVAL '40 days'),
('a8888888-8888-8888-8888-888888888888', 'a4444444-4444-4444-4444-444444444444', NOW() - INTERVAL '35 days'),
('a8888888-8888-8888-8888-888888888888', 'c6666666-6666-6666-6666-666666666666', NOW() - INTERVAL '30 days'),

-- Ian follows
('a9999999-9999-9999-9999-999999999999', 'a3333333-3333-3333-3333-333333333333', NOW() - INTERVAL '45 days'),
('a9999999-9999-9999-9999-999999999999', 'c8888888-8888-8888-8888-888888888888', NOW() - INTERVAL '40 days'),
('a9999999-9999-9999-9999-999999999999', 'b8888888-8888-8888-8888-888888888888', NOW() - INTERVAL '35 days'),
('a9999999-9999-9999-9999-999999999999', 'd3333333-3333-3333-3333-333333333333', NOW() - INTERVAL '30 days'),
('a9999999-9999-9999-9999-999999999999', 'b4444444-4444-4444-4444-444444444444', NOW() - INTERVAL '25 days'),
('a9999999-9999-9999-9999-999999999999', 'c1111111-1111-1111-1111-111111111111', NOW() - INTERVAL '20 days'),

-- Julia follows
('b1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', NOW() - INTERVAL '40 days'),
('b1111111-1111-1111-1111-111111111111', 'c9999999-9999-9999-9999-999999999999', NOW() - INTERVAL '35 days'),
('b1111111-1111-1111-1111-111111111111', 'a8888888-8888-8888-8888-888888888888', NOW() - INTERVAL '30 days'),
('b1111111-1111-1111-1111-111111111111', 'c4444444-4444-4444-4444-444444444444', NOW() - INTERVAL '25 days'),
('b1111111-1111-1111-1111-111111111111', 'a4444444-4444-4444-4444-444444444444', NOW() - INTERVAL '20 days'),

-- Kevin follows
('b2222222-2222-2222-2222-222222222222', 'a4444444-4444-4444-4444-444444444444', NOW() - INTERVAL '35 days'),
('b2222222-2222-2222-2222-222222222222', 'a7777777-7777-7777-7777-777777777777', NOW() - INTERVAL '30 days'),
('b2222222-2222-2222-2222-222222222222', 'b7777777-7777-7777-7777-777777777777', NOW() - INTERVAL '25 days'),
('b2222222-2222-2222-2222-222222222222', 'c7777777-7777-7777-7777-777777777777', NOW() - INTERVAL '20 days'),
('b2222222-2222-2222-2222-222222222222', 'c2222222-2222-2222-2222-222222222222', NOW() - INTERVAL '15 days'),
('b2222222-2222-2222-2222-222222222222', 'c5555555-5555-5555-5555-555555555555', NOW() - INTERVAL '10 days'),

-- Continue with more follows for remaining users...
-- Laura follows
('b3333333-3333-3333-3333-333333333333', 'a3333333-3333-3333-3333-333333333333', NOW() - INTERVAL '30 days'),
('b3333333-3333-3333-3333-333333333333', 'c4444444-4444-4444-4444-444444444444', NOW() - INTERVAL '25 days'),
('b3333333-3333-3333-3333-333333333333', 'c7777777-7777-7777-7777-777777777777', NOW() - INTERVAL '20 days'),
('b3333333-3333-3333-3333-333333333333', 'b4444444-4444-4444-4444-444444444444', NOW() - INTERVAL '15 days'),

-- Mike follows
('b4444444-4444-4444-4444-444444444444', 'a2222222-2222-2222-2222-222222222222', NOW() - INTERVAL '25 days'),
('b4444444-4444-4444-4444-444444444444', 'a3333333-3333-3333-3333-333333333333', NOW() - INTERVAL '20 days'),
('b4444444-4444-4444-4444-444444444444', 'b8888888-8888-8888-8888-888888888888', NOW() - INTERVAL '15 days'),
('b4444444-4444-4444-4444-444444444444', 'b3333333-3333-3333-3333-333333333333', NOW() - INTERVAL '10 days'),
('b4444444-4444-4444-4444-444444444444', 'a9999999-9999-9999-9999-999999999999', NOW() - INTERVAL '5 days'),

-- Nina follows
('b5555555-5555-5555-5555-555555555555', 'a5555555-5555-5555-5555-555555555555', NOW() - INTERVAL '25 days'),
('b5555555-5555-5555-5555-555555555555', 'c5555555-5555-5555-5555-555555555555', NOW() - INTERVAL '20 days'),
('b5555555-5555-5555-5555-555555555555', 'b9999999-9999-9999-9999-999999999999', NOW() - INTERVAL '15 days'),
('b5555555-5555-5555-5555-555555555555', 'c2222222-2222-2222-2222-222222222222', NOW() - INTERVAL '10 days'),

-- Oscar follows
('b6666666-6666-6666-6666-666666666666', 'a1111111-1111-1111-1111-111111111111', NOW() - INTERVAL '20 days'),
('b6666666-6666-6666-6666-666666666666', 'c8888888-8888-8888-8888-888888888888', NOW() - INTERVAL '15 days'),
('b6666666-6666-6666-6666-666666666666', 'd3333333-3333-3333-3333-333333333333', NOW() - INTERVAL '10 days'),
('b6666666-6666-6666-6666-666666666666', 'a8888888-8888-8888-8888-888888888888', NOW() - INTERVAL '5 days'),

-- Paula follows
('b7777777-7777-7777-7777-777777777777', 'a4444444-4444-4444-4444-444444444444', NOW() - INTERVAL '18 days'),
('b7777777-7777-7777-7777-777777777777', 'b2222222-2222-2222-2222-222222222222', NOW() - INTERVAL '15 days'),
('b7777777-7777-7777-7777-777777777777', 'a6666666-6666-6666-6666-666666666666', NOW() - INTERVAL '12 days'),
('b7777777-7777-7777-7777-777777777777', 'c3333333-3333-3333-3333-333333333333', NOW() - INTERVAL '8 days'),

-- Quinn follows
('b8888888-8888-8888-8888-888888888888', 'a3333333-3333-3333-3333-333333333333', NOW() - INTERVAL '15 days'),
('b8888888-8888-8888-8888-888888888888', 'b4444444-4444-4444-4444-444444444444', NOW() - INTERVAL '12 days'),
('b8888888-8888-8888-8888-888888888888', 'a9999999-9999-9999-9999-999999999999', NOW() - INTERVAL '8 days'),
('b8888888-8888-8888-8888-888888888888', 'b3333333-3333-3333-3333-333333333333', NOW() - INTERVAL '5 days'),

-- Rachel follows
('b9999999-9999-9999-9999-999999999999', 'a5555555-5555-5555-5555-555555555555', NOW() - INTERVAL '15 days'),
('b9999999-9999-9999-9999-999999999999', 'b5555555-5555-5555-5555-555555555555', NOW() - INTERVAL '12 days'),
('b9999999-9999-9999-9999-999999999999', 'c2222222-2222-2222-2222-222222222222', NOW() - INTERVAL '8 days'),
('b9999999-9999-9999-9999-999999999999', 'c5555555-5555-5555-5555-555555555555', NOW() - INTERVAL '5 days'),

-- Sam follows
('c1111111-1111-1111-1111-111111111111', 'a5555555-5555-5555-5555-555555555555', NOW() - INTERVAL '12 days'),
('c1111111-1111-1111-1111-111111111111', 'a9999999-9999-9999-9999-999999999999', NOW() - INTERVAL '10 days'),
('c1111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', NOW() - INTERVAL '8 days'),
('c1111111-1111-1111-1111-111111111111', 'c3333333-3333-3333-3333-333333333333', NOW() - INTERVAL '5 days'),

-- Tina follows
('c2222222-2222-2222-2222-222222222222', 'a6666666-6666-6666-6666-666666666666', NOW() - INTERVAL '10 days'),
('c2222222-2222-2222-2222-222222222222', 'c5555555-5555-5555-5555-555555555555', NOW() - INTERVAL '8 days'),
('c2222222-2222-2222-2222-222222222222', 'b9999999-9999-9999-9999-999999999999', NOW() - INTERVAL '6 days'),
('c2222222-2222-2222-2222-222222222222', 'd2222222-2222-2222-2222-222222222222', NOW() - INTERVAL '4 days'),

-- Uma follows
('c3333333-3333-3333-3333-333333333333', 'a8888888-8888-8888-8888-888888888888', NOW() - INTERVAL '10 days'),
('c3333333-3333-3333-3333-333333333333', 'a4444444-4444-4444-4444-444444444444', NOW() - INTERVAL '8 days'),
('c3333333-3333-3333-3333-333333333333', 'b7777777-7777-7777-7777-777777777777', NOW() - INTERVAL '6 days'),
('c3333333-3333-3333-3333-333333333333', 'c6666666-6666-6666-6666-666666666666', NOW() - INTERVAL '4 days'),

-- Victor follows
('c4444444-4444-4444-4444-444444444444', 'b1111111-1111-1111-1111-111111111111', NOW() - INTERVAL '8 days'),
('c4444444-4444-4444-4444-444444444444', 'b3333333-3333-3333-3333-333333333333', NOW() - INTERVAL '6 days'),
('c4444444-4444-4444-4444-444444444444', 'c9999999-9999-9999-9999-999999999999', NOW() - INTERVAL '4 days'),
('c4444444-4444-4444-4444-444444444444', 'c7777777-7777-7777-7777-777777777777', NOW() - INTERVAL '2 days'),

-- Wendy follows
('c5555555-5555-5555-5555-555555555555', 'a7777777-7777-7777-7777-777777777777', NOW() - INTERVAL '8 days'),
('c5555555-5555-5555-5555-555555555555', 'c2222222-2222-2222-2222-222222222222', NOW() - INTERVAL '6 days'),
('c5555555-5555-5555-5555-555555555555', 'b9999999-9999-9999-9999-999999999999', NOW() - INTERVAL '4 days'),
('c5555555-5555-5555-5555-555555555555', 'b2222222-2222-2222-2222-222222222222', NOW() - INTERVAL '2 days'),

-- Xander follows
('c6666666-6666-6666-6666-666666666666', 'a4444444-4444-4444-4444-444444444444', NOW() - INTERVAL '6 days'),
('c6666666-6666-6666-6666-666666666666', 'b6666666-6666-6666-6666-666666666666', NOW() - INTERVAL '5 days'),
('c6666666-6666-6666-6666-666666666666', 'a8888888-8888-8888-8888-888888888888', NOW() - INTERVAL '4 days'),
('c6666666-6666-6666-6666-666666666666', 'c3333333-3333-3333-3333-333333333333', NOW() - INTERVAL '3 days'),

-- Yara follows
('c7777777-7777-7777-7777-777777777777', 'b3333333-3333-3333-3333-333333333333', NOW() - INTERVAL '6 days'),
('c7777777-7777-7777-7777-777777777777', 'a7777777-7777-7777-7777-777777777777', NOW() - INTERVAL '5 days'),
('c7777777-7777-7777-7777-777777777777', 'b2222222-2222-2222-2222-222222222222', NOW() - INTERVAL '4 days'),
('c7777777-7777-7777-7777-777777777777', 'c4444444-4444-4444-4444-444444444444', NOW() - INTERVAL '3 days'),

-- Zack follows
('c8888888-8888-8888-8888-888888888888', 'a9999999-9999-9999-9999-999999999999', NOW() - INTERVAL '5 days'),
('c8888888-8888-8888-8888-888888888888', 'b6666666-6666-6666-6666-666666666666', NOW() - INTERVAL '4 days'),
('c8888888-8888-8888-8888-888888888888', 'd3333333-3333-3333-3333-333333333333', NOW() - INTERVAL '3 days'),
('c8888888-8888-8888-8888-888888888888', 'a1111111-1111-1111-1111-111111111111', NOW() - INTERVAL '2 days'),

-- Amy follows
('c9999999-9999-9999-9999-999999999999', 'b1111111-1111-1111-1111-111111111111', NOW() - INTERVAL '4 days'),
('c9999999-9999-9999-9999-999999999999', 'a1111111-1111-1111-1111-111111111111', NOW() - INTERVAL '3 days'),
('c9999999-9999-9999-9999-999999999999', 'c4444444-4444-4444-4444-444444444444', NOW() - INTERVAL '2 days'),
('c9999999-9999-9999-9999-999999999999', 'd3333333-3333-3333-3333-333333333333', NOW() - INTERVAL '1 day'),

-- Ben follows
('d1111111-1111-1111-1111-111111111111', 'a2222222-2222-2222-2222-222222222222', NOW() - INTERVAL '3 days'),
('d1111111-1111-1111-1111-111111111111', 'a3333333-3333-3333-3333-333333333333', NOW() - INTERVAL '2 days'),
('d1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', NOW() - INTERVAL '1 day'),

-- Cathy follows
('d2222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222222', NOW() - INTERVAL '2 days'),
('d2222222-2222-2222-2222-222222222222', 'a6666666-6666-6666-6666-666666666666', NOW() - INTERVAL '1 day'),
('d2222222-2222-2222-2222-222222222222', 'c2222222-2222-2222-2222-222222222222', NOW() - INTERVAL '12 hours'),

-- Derek follows
('d3333333-3333-3333-3333-333333333333', 'a9999999-9999-9999-9999-999999999999', NOW() - INTERVAL '1 day'),
('d3333333-3333-3333-3333-333333333333', 'b1111111-1111-1111-1111-111111111111', NOW() - INTERVAL '12 hours'),
('d3333333-3333-3333-3333-333333333333', 'a4444444-4444-4444-4444-444444444444', NOW() - INTERVAL '6 hours');

-- ============================================
-- 5. INSERT LIKES (Random likes on posts)
-- ============================================
INSERT INTO likes (user_id, post_id, created_at) VALUES
-- Likes on various posts
('a1111111-1111-1111-1111-111111111111', 3, NOW() - INTERVAL '2 days'),
('a1111111-1111-1111-1111-111111111111', 5, NOW() - INTERVAL '1 day'),
('a1111111-1111-1111-1111-111111111111', 15, NOW() - INTERVAL '3 days'),
('a2222222-2222-2222-2222-222222222222', 1, NOW() - INTERVAL '4 days'),
('a2222222-2222-2222-2222-222222222222', 8, NOW() - INTERVAL '12 hours'),
('a3333333-3333-3333-3333-333333333333', 5, NOW() - INTERVAL '1 day'),
('a3333333-3333-3333-3333-333333333333', 19, NOW() - INTERVAL '12 hours'),
('a4444444-4444-4444-4444-444444444444', 1, NOW() - INTERVAL '4 days'),
('a4444444-4444-4444-4444-444444444444', 24, NOW() - INTERVAL '1 day'),
('a5555555-5555-5555-5555-555555555555', 10, NOW() - INTERVAL '12 hours'),
('a5555555-5555-5555-5555-555555555555', 3, NOW() - INTERVAL '2 days'),
('a6666666-6666-6666-6666-666666666666', 1, NOW() - INTERVAL '4 days'),
('a6666666-6666-6666-6666-666666666666', 15, NOW() - INTERVAL '3 days'),
('a7777777-7777-7777-7777-777777777777', 50, NOW() - INTERVAL '12 hours'),
('a8888888-8888-8888-8888-888888888888', 1, NOW() - INTERVAL '4 days'),
('a9999999-9999-9999-9999-999999999999', 19, NOW() - INTERVAL '12 hours'),
('b1111111-1111-1111-1111-111111111111', 22, NOW() - INTERVAL '4 days'),
('b2222222-2222-2222-2222-222222222222', 24, NOW() - INTERVAL '1 day'),
('b3333333-3333-3333-3333-333333333333', 5, NOW() - INTERVAL '1 day'),
('b4444444-4444-4444-4444-444444444444', 28, NOW() - INTERVAL '3 days'),
('b5555555-5555-5555-5555-555555555555', 30, NOW() - INTERVAL '12 hours'),
('b6666666-6666-6666-6666-666666666666', 32, NOW() - INTERVAL '1 day'),
('b7777777-7777-7777-7777-777777777777', 8, NOW() - INTERVAL '12 hours'),
('b8888888-8888-8888-8888-888888888888', 36, NOW() - INTERVAL '12 hours'),
('b9999999-9999-9999-9999-999999999999', 38, NOW() - INTERVAL '1 day'),
('c1111111-1111-1111-1111-111111111111', 10, NOW() - INTERVAL '12 hours'),
('c2222222-2222-2222-2222-222222222222', 50, NOW() - INTERVAL '12 hours'),
('c3333333-3333-3333-3333-333333333333', 30, NOW() - INTERVAL '12 hours'),
('c4444444-4444-4444-4444-444444444444', 22, NOW() - INTERVAL '4 days'),
('c5555555-5555-5555-5555-555555555555', 50, NOW() - INTERVAL '12 hours'),
('c6666666-6666-6666-6666-666666666666', 8, NOW() - INTERVAL '12 hours'),
('c7777777-7777-7777-7777-777777777777', 15, NOW() - INTERVAL '3 days'),
('c8888888-8888-8888-8888-888888888888', 54, NOW() - INTERVAL '12 hours'),
('c9999999-9999-9999-9999-999999999999', 56, NOW() - INTERVAL '1 day'),
('d1111111-1111-1111-1111-111111111111', 3, NOW() - INTERVAL '2 days'),
('d2222222-2222-2222-2222-222222222222', 3, NOW() - INTERVAL '2 days'),
('d3333333-3333-3333-3333-333333333333', 60, NOW() - INTERVAL '12 hours');

-- ============================================
-- 6. INSERT REPORTS (Sample reports for testing)
-- ============================================
-- Reports table: reason (0-4), state (0=PENDING, 1=APPROVED, 2=REJECTED)
-- Reasons: 0=SPAM, 1=HARASSMENT, 2=HATE_SPEECH, 3=MISINFORMATION, 4=OTHER

INSERT INTO reports (reported_by_id, reported_id, reason, state, created_at) VALUES
-- Some pending reports
('a1111111-1111-1111-1111-111111111111', 54, 0, 0, NOW() - INTERVAL '2 days'),  -- Spam report on meme post
('b3333333-3333-3333-3333-333333333333', 36, 3, 0, NOW() - INTERVAL '1 day'),   -- Misinformation on crypto post
('c5555555-5555-5555-5555-555555555555', 32, 4, 0, NOW() - INTERVAL '12 hours'), -- Other on comedy post

-- Some approved reports
('a5555555-5555-5555-5555-555555555555', 5, 0, 1, NOW() - INTERVAL '5 days'),   -- Approved spam report
('b1111111-1111-1111-1111-111111111111', 19, 4, 1, NOW() - INTERVAL '3 days'),  -- Approved other report

-- Some rejected reports
('c8888888-8888-8888-8888-888888888888', 22, 1, 2, NOW() - INTERVAL '4 days'),  -- Rejected harassment report
('d2222222-2222-2222-2222-222222222222', 15, 4, 2, NOW() - INTERVAL '2 days');  -- Rejected other report

COMMIT;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify the data was inserted correctly:
--
-- SELECT COUNT(*) FROM users WHERE role = false;  -- Should be 30
-- SELECT COUNT(*) FROM posts;                     -- Should be 60+
-- SELECT COUNT(*) FROM comments;                  -- Should be 50+
-- SELECT COUNT(*) FROM subscriptions;             -- Should be 100+
-- SELECT COUNT(*) FROM likes;                     -- Should be 35+
-- SELECT COUNT(*) FROM reports;                   -- Should be 7
-- ============================================
