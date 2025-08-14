-- Deactiveer alle categorieën behalve de 6 hoofdcategorieën
UPDATE categories 
SET is_active = false 
WHERE slug NOT IN (
  'top-verkopers-gescreend',
  'wiet-online-kopen', 
  'wiet-gezocht',
  'lokale-leveranciers',
  'forum-regelement',
  'algemeen-forum'
);