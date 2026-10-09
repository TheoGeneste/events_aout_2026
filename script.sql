INSERT INTO users (us_id, us_username, us_password, us_email) VALUES
(1, 'alice martin', '$2b$10$QUgFeViUQkBzXkyJwft12uhtQJrWKxMSFMEnlPixphMGKXRpbw4C2', 'alice.martin@example.com'),
(2, 'benoit durand', '$2b$10$QUgFeViUQkBzXkyJwft12uhtQJrWKxMSFMEnlPixphMGKXRpbw4C2', 'benoit.durand@example.com'),
(3, 'camille petit', '$2b$10$QUgFeViUQkBzXkyJwft12uhtQJrWKxMSFMEnlPixphMGKXRpbw4C2', 'camille.petit@example.com'),
(4, 'david robert', '$2b$10$QUgFeViUQkBzXkyJwft12uhtQJrWKxMSFMEnlPixphMGKXRpbw4C2', 'david.robert@example.com'),
(5, 'emma richard', '$2b$10$QUgFeViUQkBzXkyJwft12uhtQJrWKxMSFMEnlPixphMGKXRpbw4C2', 'emma.richard@example.com'),
(6, 'florian moreau', '$2b$10$QUgFeViUQkBzXkyJwft12uhtQJrWKxMSFMEnlPixphMGKXRpbw4C2', 'florian.moreau@example.com'),
(7, 'jade simon', '$2b$10$QUgFeViUQkBzXkyJwft12uhtQJrWKxMSFMEnlPixphMGKXRpbw4C2', 'jade.simon@example.com'),
(8, 'leo laurent', '$2b$10$QUgFeViUQkBzXkyJwft12uhtQJrWKxMSFMEnlPixphMGKXRpbw4C2', 'leo.laurent@example.com'),
(9, 'maya michel', '$2b$10$QUgFeViUQkBzXkyJwft12uhtQJrWKxMSFMEnlPixphMGKXRpbw4C2', 'maya.michel@example.com'),
(10, 'nathan garcia', '$2b$10$QUgFeViUQkBzXkyJwft12uhtQJrWKxMSFMEnlPixphMGKXRpbw4C2', 'nathan.garcia@example.com');

INSERT INTO events (ev_id, ev_title, ev_description, ev_date, ev_location, ev_owner) VALUES
(1, 'Concert au parc', 'Une soiree musicale en plein air avec des groupes locaux.', '2026-08-01', 'Parc de la Villette, Paris', 1),
(2, 'Atelier de photographie', 'Initiation aux bases de la photographie et de la composition.', '2026-08-03', 'Maison des Associations, Lyon', 2),
(3, 'Marche des producteurs', 'Rencontre avec les producteurs et degustation de produits locaux.', '2026-08-05', 'Place des Lices, Rennes', 3),
(4, 'Tournoi de jeux de societe', 'Apportez vos jeux preferes pour une apres-midi conviviale.', '2026-08-08', 'Salle municipale, Nantes', 4),
(5, 'Projection en plein air', 'Projection d un film familial sous les etoiles.', '2026-08-10', 'Jardin des Plantes, Toulouse', 5),
(6, 'Course solidaire', 'Une course ouverte a tous au profit d une association locale.', '2026-08-13', 'Parc Borely, Marseille', 6),
(7, 'Initiation au yoga', 'Une seance de yoga accessible aux debutants.', '2026-08-16', 'Esplanade du Lac, Annecy', 7),
(8, 'Salon des associations', 'Decouvrez les associations et leurs activites pour la rentree.', '2026-08-19', 'Hotel de Ville, Bordeaux', 8),
(9, 'Atelier cuisine d ete', 'Preparation collective de recettes simples de saison.', '2026-08-22', 'Cuisine partagee, Lille', 9),
(10, 'Soiree de cloture', 'Une soiree festive pour terminer le mois ensemble.', '2026-08-29', 'Quai de la Fosse, Nantes', 10);

INSERT INTO comments (co_id, co_comment, co_user, co_event) VALUES
(1, 'J ai hate de decouvrir les groupes invites !', 2, 1),
(2, 'Faut-il apporter son propre appareil photo ?', 3, 2),
(3, 'Les produits locaux seront-ils disponibles a emporter ?', 4, 3),
(4, 'Je peux apporter un jeu de cartes en complement.', 5, 4),
(5, 'Tres bonne idee pour une sortie en famille.', 6, 5),
(6, 'Comment faire un don si je ne peux pas courir ?', 7, 6),
(7, 'Un tapis de yoga sera-t-il fourni ?', 8, 7),
(8, 'Est-ce que les associations peuvent encore s inscrire ?', 9, 8),
(9, 'Doit-on apporter des ingredients pour l atelier ?', 10, 9),
(10, 'La soiree est-elle accessible aux enfants ?', 1, 10);

INSERT INTO participants (pa_user, pa_event) VALUES
(2, 1),
(3, 2),
(4, 3),
(5, 4),
(6, 5),
(7, 6),
(8, 7),
(9, 8),
(10, 9),
(1, 10);
