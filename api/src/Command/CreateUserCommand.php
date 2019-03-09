<?php

namespace App\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use App\Entity\User;
use Symfony\Component\DependencyInjection\ContainerInterface;

class CreateUserCommand extends Command
{
    protected static $defaultName = 'rota:create-user';

    /**
     * @var UserPasswordEncoderInterface
     */
    private $encoder;

    /**
     * @var ContainerInterface
     */
    private $container;


    public function __construct(ContainerInterface $container, UserPasswordEncoderInterface $encoder) {
        $this->container = $container;
        $this->encoder = $encoder;

        parent::__construct();
    }

    protected function configure()
    {
        $this
            ->setDescription('Creates a new user.')
            ->setHelp('This command allows you to create a user...');

        $this
            ->addArgument('email', InputArgument::REQUIRED, 'The email of the user.')
            ->addArgument('password', InputArgument::REQUIRED, 'The password for the user.');
    }

    /**
     * @param InputInterface $input
     * @param OutputInterface $output
     * @return int|null|void
     * @throws \Lexik\Bundle\JWTAuthenticationBundle\Exception\JWTEncodeFailureException
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $email = $input->getArgument('email');

        $user = new User($email);

        $pass = $this->encoder->encodePassword($user, $input->getArgument('password'));
        $user->setEmail($email);
        $user->setPassword($pass);

        $em = $this->container->get('doctrine')->getManager();
        $em->persist($user);
        $em->flush();

    }
}