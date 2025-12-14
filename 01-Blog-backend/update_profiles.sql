-- ============================================
-- Update User Profiles with Random Images
-- ============================================
-- This script assigns profile images to 27 out of 30 users (~90%)
-- Leaving 3 users without profiles for testing purposes

BEGIN;

UPDATE users SET profile = 'profile_1.jpg' WHERE id = 'a1111111-1111-1111-1111-111111111111';
UPDATE users SET profile = 'profile_2.jpg' WHERE id = 'a2222222-2222-2222-2222-222222222222';
UPDATE users SET profile = 'profile_3.jpg' WHERE id = 'a3333333-3333-3333-3333-333333333333';
UPDATE users SET profile = 'profile_4.jpg' WHERE id = 'a4444444-4444-4444-4444-444444444444';
UPDATE users SET profile = 'profile_5.jpg' WHERE id = 'a5555555-5555-5555-5555-555555555555';
UPDATE users SET profile = 'profile_6.jpg' WHERE id = 'a6666666-6666-6666-6666-666666666666';
UPDATE users SET profile = 'profile_7.jpg' WHERE id = 'a7777777-7777-7777-7777-777777777777';
UPDATE users SET profile = 'profile_8.jpg' WHERE id = 'a8888888-8888-8888-8888-888888888888';
UPDATE users SET profile = 'profile_9.jpg' WHERE id = 'a9999999-9999-9999-9999-999999999999';
UPDATE users SET profile = 'profile_10.jpg' WHERE id = 'b1111111-1111-1111-1111-111111111111';
UPDATE users SET profile = 'profile_11.jpg' WHERE id = 'b2222222-2222-2222-2222-222222222222';
UPDATE users SET profile = 'profile_12.jpg' WHERE id = 'b3333333-3333-3333-3333-333333333333';
UPDATE users SET profile = 'profile_13.jpg' WHERE id = 'b4444444-4444-4444-4444-444444444444';
UPDATE users SET profile = 'profile_14.jpg' WHERE id = 'b5555555-5555-5555-5555-555555555555';
UPDATE users SET profile = 'profile_15.jpg' WHERE id = 'b6666666-6666-6666-6666-666666666666';
UPDATE users SET profile = 'profile_16.jpg' WHERE id = 'b7777777-7777-7777-7777-777777777777';
UPDATE users SET profile = 'profile_17.jpg' WHERE id = 'b8888888-8888-8888-8888-888888888888';
UPDATE users SET profile = 'profile_18.jpg' WHERE id = 'b9999999-9999-9999-9999-999999999999';
UPDATE users SET profile = 'profile_19.jpg' WHERE id = 'c1111111-1111-1111-1111-111111111111';
UPDATE users SET profile = 'profile_20.jpg' WHERE id = 'c2222222-2222-2222-2222-222222222222';
UPDATE users SET profile = 'profile_21.jpg' WHERE id = 'c3333333-3333-3333-3333-333333333333';
UPDATE users SET profile = 'profile_22.jpg' WHERE id = 'c4444444-4444-4444-4444-444444444444';
UPDATE users SET profile = 'profile_23.jpg' WHERE id = 'c5555555-5555-5555-5555-555555555555';
UPDATE users SET profile = 'profile_24.jpg' WHERE id = 'c6666666-6666-6666-6666-666666666666';
UPDATE users SET profile = 'profile_25.jpg' WHERE id = 'c7777777-7777-7777-7777-777777777777';
UPDATE users SET profile = 'profile_26.jpg' WHERE id = 'c8888888-8888-8888-8888-888888888888';
UPDATE users SET profile = 'profile_27.jpg' WHERE id = 'c9999999-9999-9999-9999-999999999999';

-- The following 3 users will remain without profile images (10%):
-- d1111111-1111-1111-1111-111111111111 (ben_cars)
-- d2222222-2222-2222-2222-222222222222 (cathy_diy)
-- d3333333-3333-3333-3333-333333333333 (derek_film)

COMMIT;

-- Verification query
SELECT 
    COUNT(*) as total_users,
    COUNT(profile) as users_with_profiles,
    COUNT(*) - COUNT(profile) as users_without_profiles,
    ROUND(COUNT(profile)::numeric / COUNT(*)::numeric * 100, 2) as percentage_with_profiles
FROM users 
WHERE role = false;
