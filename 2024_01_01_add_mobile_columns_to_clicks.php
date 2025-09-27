<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddMobileColumnsToClicks extends Migration
{
    public function up()
    {
        Schema::table('clicks', function (Blueprint $table) {
            $table->string('device_type')->nullable()->after('device');
            $table->string('os')->nullable()->after('device_type');
            $table->string('screen_resolution')->nullable()->after('os');
            $table->boolean('is_mobile')->default(false)->after('is_unique');
            $table->boolean('is_tablet')->default(false)->after('is_mobile');
            $table->string('carrier')->nullable()->after('is_tablet');
            $table->string('app_version')->nullable()->after('carrier');
        });
    }
}