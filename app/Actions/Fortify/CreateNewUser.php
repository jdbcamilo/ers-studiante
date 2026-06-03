<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
        ])->validate();

        $birthDate = new \DateTime($input['birth_date']);
        $today = new \DateTime();
        $age = $today->diff($birthDate)->y;

        return User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'password' => $input['password'],
            'cedula' => $input['cedula'],
            'birth_date' => $input['birth_date'],
            'age' => $age,
            'gender' => $input['gender'],
            'role' => $input['role'],
            'department' => $input['department'],
            'semester' => $input['role'] === 'student' ? $input['semester'] : null,
            'status' => 'active',
        ]);
    }
}
