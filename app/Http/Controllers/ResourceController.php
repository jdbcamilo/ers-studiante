<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class ResourceController extends Controller
{
    public function index()
    {
        return Inertia::render('resources');
    }
}
