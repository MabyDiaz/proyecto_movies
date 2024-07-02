-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 01-07-2024 a las 23:24:06
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `movie_app`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `generos`
--

CREATE TABLE `generos` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `id_tmdb` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movies`
--

CREATE TABLE `movies` (
  `id` int(11) NOT NULL,
  `titulo` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `fecha_de_lanzamiento` date DEFAULT NULL,
  `generos_id` int(11) DEFAULT NULL,
  `id_tmdb` int(11) DEFAULT NULL,
  `calificacion` decimal(3,1) DEFAULT NULL,
  `poster_path` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movies_genres`
--

CREATE TABLE `movies_genres` (
  `movie_id` int(11) NOT NULL,
  `genre_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `usuarios_id` int(11) DEFAULT NULL,
  `movies_id` int(11) DEFAULT NULL,
  `reseña` text DEFAULT NULL,
  `calificacion` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `apellido` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `fechaNacimiento` date NOT NULL,
  `pais` varchar(255) NOT NULL,
  `terminos` tinyint(1) NOT NULL,
  `isAdmin` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `apellido`, `email`, `password`, `fechaNacimiento`, `pais`, `terminos`, `isAdmin`) VALUES
(30, 'Marcelo', 'Vocos', 'mvocos@gmail.com', '$2b$10$2xw0ncI8ew/XUD2n23uRb.r/7QKQLz6dtcYkWGN3lt.1LaX/zpmuq', '0000-00-00', 'CO', 1, 0),
(32, 'admin', 'admin', 'admin@example.com', '$2b$10$fM9LGnv3w3pqEmniYzuNbeqlUj4Q4FQrHQGYU1y1e24bbWkZZ1ulm', '2024-06-20', 'AR', 1, 1),
(35, 'Fabian', 'Alvarez', 'ja@gmail.com', '$2b$10$N2IoJ3w63pDv8LMS2Ys/r.LDD0XVoX3kqbo8FVMLhgRtff5hw8fZm', '2024-07-17', 'AR', 1, 1),
(36, 'Marcela', 'Longo', 'ml@gmail.com', '$2b$10$Kx9wzkloptDGyxrFSA5LA.oOSQMhX8IOoBSeJIXBMIqYiuOvfmnhS', '0000-00-00', 'PE', 1, 0),
(37, 'Pedro', 'Araya', 'pa@gmail.com', '$2b$10$//PwDlqdojwqDa1axuJacecy6qiB62q8fTGlxh8.Y4SX2MtPMBTG2', '0000-00-00', 'CH', 1, 1),
(38, 'Juan', 'Perez', 'juanperez@example.com', '$2b$10$RXop/lK3tReLPAd18EqebOERX9xr/CYZ1ctzkBt2jeXKSviKWBnTa', '1990-01-01', 'Argentina', 1, 0);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `generos`
--
ALTER TABLE `generos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id_tmdb` (`id_tmdb`);

--
-- Indices de la tabla `movies`
--
ALTER TABLE `movies`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id_tmdb` (`id_tmdb`),
  ADD KEY `generos_id` (`generos_id`);

--
-- Indices de la tabla `movies_genres`
--
ALTER TABLE `movies_genres`
  ADD PRIMARY KEY (`movie_id`,`genre_id`),
  ADD KEY `genre_id` (`genre_id`);

--
-- Indices de la tabla `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuarios_id` (`usuarios_id`),
  ADD KEY `movies_id` (`movies_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`(191));

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `generos`
--
ALTER TABLE `generos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `movies`
--
ALTER TABLE `movies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `movies`
--
ALTER TABLE `movies`
  ADD CONSTRAINT `movies_ibfk_1` FOREIGN KEY (`generos_id`) REFERENCES `generos` (`id`);

--
-- Filtros para la tabla `movies_genres`
--
ALTER TABLE `movies_genres`
  ADD CONSTRAINT `movies_genres_ibfk_1` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`),
  ADD CONSTRAINT `movies_genres_ibfk_2` FOREIGN KEY (`genre_id`) REFERENCES `generos` (`id`);

--
-- Filtros para la tabla `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`usuarios_id`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`movies_id`) REFERENCES `movies` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
