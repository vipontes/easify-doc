SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

CREATE TABLE `empresa` (
  `empresa_id` int(11) NOT NULL,
  `empresa_nome` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Empresas clientes do serviço SaaS';

CREATE TABLE `usuario` (
  `usuario_id` int(11) NOT NULL,
  `usuario_nome` varchar(100) NOT NULL,
  `usuario_email` varchar(128) NOT NULL,
  `usuario_senha` varchar(128) NOT NULL,
  `usuario_ativo` int(1) NOT NULL DEFAULT '1',
  `empresa_id` int(11) NOT NULL,
  `usuario_token` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Usuários ligados as empresas';

ALTER TABLE `empresa`
  ADD PRIMARY KEY (`empresa_id`);

ALTER TABLE `usuario`
  ADD PRIMARY KEY (`usuario_id`),
  ADD UNIQUE KEY `usuario_email_UNIQUE` (`usuario_email`),
  ADD KEY `fk_usuario_1_idx` (`empresa_id`);

ALTER TABLE `empresa`
  MODIFY `empresa_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

ALTER TABLE `usuario`
  MODIFY `usuario_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

ALTER TABLE `usuario`
  ADD CONSTRAINT `fk_usuario_1` FOREIGN KEY (`empresa_id`) REFERENCES `empresa` (`empresa_id`) ON UPDATE CASCADE;
