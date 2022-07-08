<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DefaultController extends AbstractController
{

    #[
        Route(
            path: '/',
            name: 'home'
        )
    ]
    public function home(): Response
    {
        return $this->render('@components/Page/PHome/PHome.twig');
    }

}