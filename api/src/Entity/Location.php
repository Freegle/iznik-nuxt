<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiResource;

/**
 * A physical location such as a hospital.
 *
 * @ORM\Entity
 * @ApiResource
 */
class Location
{
    /**
     * @var int The id of this location.
     *
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @var string The name of this location.
     *
     * @ORM\Column
     */
    public $name;

    /**
     * @var integer The required number of slots for this location
     *
     * @ORM\Column(type="integer")
     */
    public $slotsRequired;

    /**
     * @var Slot[] The slots for this location.
     *
     * @ORM\OneToMany(targetEntity="Slot", mappedBy="location")
     */
    public $slots;

    public function __construct()
    {
        $this->slots = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }
}