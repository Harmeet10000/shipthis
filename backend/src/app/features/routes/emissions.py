class EmissionCalculator:
    LAND_FACTOR = 0.062
    SEA_FACTOR = 0.016
    AIR_FACTOR = 0.602

    def calculate_land(self, *, distance_km, segments, cargo_kg):
        tonnes = cargo_kg / 1000
        base = distance_km * tonnes * self.LAND_FACTOR
        return base

    def calculate_sea(self, *, distance_km, cargo_kg):
        tonnes = cargo_kg / 1000
        return distance_km * tonnes * self.SEA_FACTOR

    def calculate_air(self, *, distance_km, cargo_kg):
        tonnes = cargo_kg / 1000
        return distance_km * tonnes * self.AIR_FACTOR
