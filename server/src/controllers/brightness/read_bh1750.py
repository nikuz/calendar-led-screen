#!/usr/bin/env python3

import smbus2
import time
import sys

I2C_BUS = 1  # Your I2C bus number (e.g., 1 for Raspberry Pi)
SENSOR_ADDR = 0x23  # Default BH1750 address

# BH1750 Commands
POWER_DOWN = 0x00
POWER_ON = 0x01
RESET = 0x07 # Not strictly needed for one-time, but can help ensure clean state
ONE_TIME_HIGH_RES = 0x20

# Measurement time for High-Res modes (max typical)
# Datasheet says 180ms max, add a small buffer.
MEASUREMENT_TIME_MAX_S = 0.2 # seconds (200ms)

bus = None # Initialize bus variable

try:
    bus = smbus2.SMBus(I2C_BUS)

    # 1. Power On (ensure sensor is active)
    #    Optional: Could add RESET before POWER_ON if needed, but
    #    power cycle often suffices.
    bus.write_byte(SENSOR_ADDR, POWER_ON)
    time.sleep(0.01) # Small delay after power on

    # 2. Send One-Time High-Resolution command
    bus.write_byte(SENSOR_ADDR, ONE_TIME_HIGH_RES)

    # 3. Wait for measurement to complete
    time.sleep(MEASUREMENT_TIME_MAX_S)

    # 4. Read the 2-byte result
    #    Reading 2 bytes directly is standard for BH1750 results.
    #    Using read_i2c_block_data with a dummy offset 0x00 is common.
    data = bus.read_i2c_block_data(SENSOR_ADDR, 0x00, 2)

    # 5. Combine bytes and calculate raw value (MSB first)
    raw_value = (data[0] << 8) | data[1]

    # 6. Power Down (good practice for one-time mode)
    #    This helps ensure the sensor is in a known state for the next run.
    try:
        bus.write_byte(SENSOR_ADDR, POWER_DOWN)
    except IOError:
        # Ignore potential error during power down if sensor is already off
        pass

    # 7. Print *only* the raw value to stdout
    print(raw_value)
    sys.exit(0) # Exit successfully

except IOError as e:
    # Print errors to stderr so they don't pollute stdout
    print(f"Error accessing BH1750 on bus {I2C_BUS} addr {hex(SENSOR_ADDR)}: {e}", file=sys.stderr)
    # Optionally print a specific value to indicate error, e.g. -1, if Node.js expects stdout
    # print("-1")
    sys.exit(1) # Exit with error code

except Exception as e:
    print(f"An unexpected error occurred: {e}", file=sys.stderr)
    # print("-1")
    sys.exit(1)

finally:
    # Ensure the bus is closed even if errors occur
    if bus:
        try:
            bus.close()
        except Exception as e:
             print(f"Error closing I2C bus: {e}", file=sys.stderr)

