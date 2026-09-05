/**
 * Android Battery Optimization & Doze Mode Management
 * Guides users to whitelist SefMed so 15-minute background location telemetry continues unimpeded.
 */

export class BatteryOptimizationService {
  /**
   * Explains why background battery exemption is necessary for MR field compliance.
   */
  public static getExemptionInstructions(): {
    title: string;
    description: string;
    steps: string[];
  } {
    return {
      title: 'Background Location & Battery Optimization',
      description: 'To record automated 15-minute clinic check-ins while your phone screen is turned off in your pocket, SefMed requires "Unrestricted" battery usage.',
      steps: [
        '1. Go to your Phone Settings -> Apps -> SefMed',
        '2. Tap on "Battery" or "Power Saver"',
        '3. Select "Unrestricted" or "Do not optimize"',
        '4. Ensure "Location" permission is set to "Allow all the time"'
      ]
    };
  }
}