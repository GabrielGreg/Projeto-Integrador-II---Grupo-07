CREATE DATABASE sistema_hospitalar
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE sistema_hospitalar;

CREATE TABLE pacientes (
    id_paciente INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    data_nascimento DATE NOT NULL,
    cpf VARCHAR(11) UNIQUE,
    telefone VARCHAR(20),
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE medicos (
    id_medico INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL
);


CREATE TABLE medicamento (
	id_medicamento INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    principio_ativo VARCHAR(150),
    dosagem VARCHAR(100)
);

CREATE TABLE atendimento (
	id_atendimento INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente INT NOT NULL,
    diagnostico VARCHAR(250) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'AGUARDANDO_TRIAGEM',
    data_atendimento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pacientes_atendimento
		FOREIGN KEY (id_paciente)
        REFERENCES pacientes (id_paciente)
    
);

CREATE TABLE triagem (
	id_triagem INT AUTO_INCREMENT PRIMARY KEY,
    id_atendimento INT NOT NULL UNIQUE,
    prioridade VARCHAR(10),
    batimentos_cardiacos INT,
    temperatura DECIMAL(4,1),
    pressao_arterial VARCHAR(20),
    queixa_principal VARCHAR (100),
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		CONSTRAINT fk_atendimento_triagem
			FOREIGN KEY (id_atendimento)
            REFERENCES atendimento(id_atendimento)
);

CREATE TABLE prescricao (
	id_medico INT NOT NULL,
    id_atendimento INT NOT NULL,
    id_medicamento INT NOT NULL,
    diagnostico VARCHAR (250),
    posologia VARCHAR(255) NOT NULL,
    quantidade INT NOT NULL,
    duracao VARCHAR(100),
		CONSTRAINT fk_medicos_prescricao 
			FOREIGN KEY (id_medico)
			REFERENCES medicos(id_medico),
		CONSTRAINT fk_atendimento_prescricao
			FOREIGN KEY (id_atendimento)
			REFERENCES atendimento(id_atendimento),
		CONSTRAINT fk_medicamento_prescricao
			FOREIGN KEY (id_medicamento)
			REFERENCES medicamento(id_medicamento)
            
);
    
