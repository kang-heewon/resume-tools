import { Router } from 'express';
import axios from 'axios';
import cheerio from 'cheerio';
import moment from 'moment';
const contributionRouter = Router();

contributionRouter.get('/:type/:githubId', (req, res) => {
  if (req.params.type === 'github') {
    axios
      .get(`http://github.com/users/${req.params.githubId}/contributions`)
      .then(response => {
        const $ = cheerio.load(response.data);
        const graph = $('div.calendar-graph').html();
        res.set('Content-Type', 'image/svg+xml');
        if (graph) res.send('<?xml version="1.0"?>' + graph);
        else res.send('');
      })
      .catch(error => {
        res.send('');
      });
  } else if (req.params.type === 'gitlab') {
    axios
      .get(`https://gitlab.com/users/${req.params.githubId}/calendar.json`)
      .then(response => {
        const Json = response.data;
        const max = Math.max.apply(null, Object.values(Json));
        const $ = cheerio.load('<svg width="722" height="112"></svg>');
        let today = moment(moment().add(-371, 'days'));
        $('svg').append(
          '<g transform="translate(10, 20)" data-hydro-click="{&quot;event_type&quot;:&quot;user_profile.click&quot;,&quot;payload&quot;:{&quot;profile_user_id&quot;:6638675,&quot;target&quot;:&quot;CONTRIBUTION_CALENDAR_SQUARE&quot;,&quot;user_id&quot;:36758131,&quot;client_id&quot;:&quot;21634736.1571236436&quot;,&quot;originating_request_id&quot;:&quot;DEF0:6E1E:4CE142:578263:5E272072&quot;,&quot;originating_url&quot;:&quot;https://github.com/users/ddarkr/contributions?to=2020-01-22&quot;,&quot;referrer&quot;:null}}" data-hydro-click-hmac="9b20ed1347f49cee3d66d9a0343999049ef206f0ff5781738f65c7c75cd777e9">'
        );
        let temp = '';

        for (let x = 0; x <= 52; x++) {
          temp += `<g transform="translate(${x * 14}, 0)">`;
          for (let y = 0; y <= 6; y++) {
            today = today.add(1, 'days');
            const date = today.format('YYYY-MM-DD');

            const count = Json.hasOwnProperty(date) ? Json[date] : 0;
            let color = '';
            if (count === 0) {
              color = '#ebedf0';
            } else {
              color = '#FFEE4A';
              const colorPoint = (count / max) * 100;
              if (colorPoint > 15) {
                color = '#FFC501';
              }
              if (colorPoint > 30) {
                color = '#FE9600';
              }
              if (colorPoint > 45) {
                color = '#03001C';
              }
            }
            temp += `<rect class="day" width="10" height="10" x="${14 -
              x}" y="${y *
              13}" fill="${color}" data-count="${count}" data-date="${date}"></rect>`;
          }
          temp += '</g>';
        }
        temp += `<text x="14" y="-7" class="month">Jan</text>
      <text x="40" y="-7" class="month">Feb</text>
      <text x="92" y="-7" class="month">Mar</text>
      <text x="157" y="-7" class="month">Apr</text>
      <text x="209" y="-7" class="month">May</text>
      <text x="261" y="-7" class="month">Jun</text>
      <text x="326" y="-7" class="month">Jul</text>
      <text x="378" y="-7" class="month">Aug</text>
      <text x="430" y="-7" class="month">Sep</text>
      <text x="495" y="-7" class="month">Oct</text>
      <text x="547" y="-7" class="month">Nov</text>
      <text x="599" y="-7" class="month">Dec</text>
      <text x="664" y="-7" class="month">Jan</text>
    <text text-anchor="start" class="wday" dx="-10" dy="8" style="display: none;">Sun</text>
    <text text-anchor="start" class="wday" dx="-10" dy="22">Mon</text>
    <text text-anchor="start" class="wday" dx="-10" dy="32" style="display: none;">Tue</text>
    <text text-anchor="start" class="wday" dx="-10" dy="48">Wed</text>
    <text text-anchor="start" class="wday" dx="-10" dy="57" style="display: none;">Thu</text>
    <text text-anchor="start" class="wday" dx="-10" dy="73">Fri</text>
    <text text-anchor="start" class="wday" dx="-10" dy="81" style="display: none;">Sat</text>`;
        $('svg g').append(temp);
        const result = $('body').html();
        res.set('Content-Type', 'image/svg+xml');
        if (result) res.send('<?xml version="1.0"?>' + result);
        else res.send('');
      })
      .catch(error => {
        res.send('');
      });
  }
});

export default contributionRouter;
