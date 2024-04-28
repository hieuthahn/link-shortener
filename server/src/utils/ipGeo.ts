import config from '@/config/config';

const getPublicIp = async () => {
  const ipEndpoints = ['https://api.ipify.org/', 'https://icanhazip.com'];
  let ip = null;
  let index = 0;
  while (ip === null && index + 1 <= ipEndpoints.length) {
    try {
      const response = await fetch(ipEndpoints[index]);
      ip = await response.text();
      break;
    } catch (error) {
      index++;
    }
  }
  return ip;
};

const getPublicIpGeo = async (ip: string) => {
  let ipGeo = null;
  const endpointsGetIpGeo = [
    `https://api.iplocation.net/?ip=${ip}`,
    `https://ipapi.co/${ip}/json/`,
    `http://ipwho.is/${ip}`,
    `https://freeipapi.com/api/json/${ip}`,
    `https://api.hackertarget.com/ipgeo/?q=${ip}`,
    `https://geo.ipify.org/api/v2/country?apiKey=${config.ipGeoApiKey.ipify}&ipAddress=${ip}`,
    `https://api.ipgeolocation.io/ipgeo?apiKey=${config.ipGeoApiKey.ipgeolocation}&ip=${ip}`,
    `https://ipinfo.io/${ip}?token=${config.ipGeoApiKey.ipinfo}`,
    `https://ipgeolocation.abstractapi.com/v1/?api_key=${config.ipGeoApiKey.ipgeolocation_abstractapi}&ip_address=${ip}`,
    `https://api.ip2location.io/?key=${config.ipGeoApiKey.ip2location}&ip=${ip}`,
    `https://api.geoapify.com/v1/ipinfo?ip=${ip}&apiKey=${config.ipGeoApiKey.geoapify}`,
    `https://api.findip.net/${ip}/?token=${config.ipGeoApiKey.findip}`,
    `https://api-bdc.net/data/ip-geolocation?ip=${ip}&key=${config.ipGeoApiKey.api_bdc}`,
  ];
  let index = 0;
  while (ipGeo === null) {
    try {
      const res = await fetch(endpointsGetIpGeo[index], { signal: AbortSignal.timeout(1000) });
      if (res.ok) {
        ipGeo = await res.json();
        break;
      }
    } catch (error) {
      console.log('get IP Geo error:', error?.message);
    } finally {
      index += 1;
    }
  }
  return ipGeo;
};

export { getPublicIp, getPublicIpGeo };
