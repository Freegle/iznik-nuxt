<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20190227190726 extends AbstractMigration
{
    public function getDescription() : string
    {
        return 'Initialise schema';
    }

    public function up(Schema $schema) : void
    {
        $this->addSql("CREATE TABLE location (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, slots_required INT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB;");
        $this->addSql("CREATE TABLE person (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB;");
        $this->addSql("CREATE TABLE slot (id INT AUTO_INCREMENT NOT NULL, location_id INT DEFAULT NULL, person_id INT DEFAULT NULL, month DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)', INDEX IDX_AC0E206764D218E (location_id), INDEX IDX_AC0E2067217BBB47 (person_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB;");
        $this->addSql("ALTER TABLE slot ADD CONSTRAINT FK_AC0E206764D218E FOREIGN KEY (location_id) REFERENCES location (id);");
        $this->addSql("ALTER TABLE slot ADD CONSTRAINT FK_AC0E2067217BBB47 FOREIGN KEY (person_id) REFERENCES person (id);");
    }

    public function down(Schema $schema) : void
    {
        $this->addSql("ALTER TABLE slot DROP FOREIGN KEY FK_AC0E206764D218E FOREIGN KEY (location_id) REFERENCES location (id);");
        $this->addSql("ALTER TABLE slot DROP FOREIGN KEY FK_AC0E2067217BBB47 FOREIGN KEY (person_id) REFERENCES person (id);");
        $this->addSql('DROP TABLE location;');
        $this->addSql('DROP TABLE person;');
        $this->addSql('DROP TABLE slot;');
    }
}
