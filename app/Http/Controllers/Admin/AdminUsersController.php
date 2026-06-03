<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\AdminService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminUsersController extends Controller
{
    public function index(AdminService $service)
    {
        return Inertia::render('admin/users', [
            'users' => $service->users(),
        ]);
    }

    public function updateStatus(Request $request, $userId, AdminService $service)
    {
        $validated = $request->validate(['status' => ['required', 'string', 'in:active,inactive']]);
        $user = $service->updateUserStatus(\App\Models\User::findOrFail($userId), $validated['status']);

        return redirect()->back()->with('success', 'Estado actualizado.');
    }

    public function updateRole(Request $request, $userId, AdminService $service)
    {
        $validated = $request->validate(['role' => ['required', 'string', 'in:student,admin']]);
        $service->updateUserRole(\App\Models\User::findOrFail($userId), $validated['role']);

        return redirect()->back()->with('success', 'Rol actualizado.');
    }

    public function destroy($userId)
    {
        $user = \App\Models\User::findOrFail($userId);
        $user->delete();

        return redirect()->back()->with('success', 'Usuario eliminado.');
    }
}