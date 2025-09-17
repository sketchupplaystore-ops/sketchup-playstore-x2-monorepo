<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('milestones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->enum('phase', ['Archicad','SketchUp','Lumion']);
            $table->enum('status', ['open','claimed','delivered','approved','revision'])->default('open');
            $table->decimal('price', 10, 2)->default(0);
            $table->string('assignee')->nullable();
            $table->json('files')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('milestones');
    }
};
