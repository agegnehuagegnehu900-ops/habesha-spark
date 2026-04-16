import { AdMob, AdmobConsentStatus, RewardAdOptions } from '@capacitor-community/admob';

const REWARDED_INTERSTITIAL_AD_ID = 'ca-app-pub-9190131594569715/2072617885';

let admobInitialized = false;

export async function initializeAdMob(): Promise<void> {
  if (admobInitialized) return;

  try {
    await AdMob.initialize();

    const consentInfo = await AdMob.requestConsentInfo();
    if (
      consentInfo.isConsentFormAvailable &&
      consentInfo.status === AdmobConsentStatus.REQUIRED
    ) {
      await AdMob.showConsentForm();
    }

    admobInitialized = true;
    console.log('AdMob initialized successfully');
  } catch (error) {
    console.error('AdMob initialization failed:', error);
  }
}

export async function showRewardedInterstitialAd(): Promise<boolean> {
  try {
    if (!admobInitialized) {
      await initializeAdMob();
    }

    const options: RewardAdOptions = {
      adId: REWARDED_INTERSTITIAL_AD_ID,
    };

    await AdMob.prepareRewardInterstitialAd(options);

    const result = await AdMob.showRewardInterstitialAd();
    console.log('Rewarded interstitial ad shown:', result);
    return true;
  } catch (error) {
    console.error('Failed to show rewarded interstitial ad:', error);
    return false;
  }
}
