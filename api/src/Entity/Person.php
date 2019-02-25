<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiResource;

/**
 * A person who can fill one or more slots.
 *
 * @ORM\Entity
 * @ApiResource
 */
class Person
{
    /**
     * @var int The id of this person
     *
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @var string The name of this person.
     *
     * @ORM\Column
     */
    public $name;

    /**
     * The slots in which this person is currently appearing, or blank.
     *
     * @ORM\OneToMany(targetEntity="Slot", mappedBy="person")
     */
    public $slots;

    public function getId(): ?int
    {
        return $this->id;
    }
}