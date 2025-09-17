<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'client_name', 'address', 'media_count'
    ];

    protected $casts = [
        'total_value' => 'decimal:2',
        'client_owes' => 'decimal:2',
    ];

    public function milestones()
    {
        return $this->hasMany(Milestone::class);
    }
}
