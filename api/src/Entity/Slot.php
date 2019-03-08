<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiResource;

/**
 * A slot links a person and a location for a particular month.
 *
 * @ORM\Entity
 * @ApiResource(mercure=true)
 */
class Slot
{
    /**
     * @var int The id of this slot.
     *
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @var \DateTimeInterface The first of the month
     *
     * @ORM\Column(type="datetime_immutable")
     */
    public $month;

    /**
     * @var Location The location this slot is for.
     *
     * @ORM\ManyToOne(targetEntity="Location", inversedBy="slots")
     */
    public $location;

    /**
     * @var Person The person who is filling this slot, if any.
     *
     * @ORM\ManyToOne(targetEntity="Person", inversedBy="slots")
     */
    public $person;

    public function getId(): ?int
    {
        return $this->id;
    }
}