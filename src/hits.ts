import { Router } from 'express';
import fs from 'fs';
import uuid from 'uuid/v4';

const hitsRouter = Router();

hitsRouter.get('/', (req, res) => {
  const name = uuid();
  fs.writeFileSync('./logs/' + name, '0', 'utf8');
  res.send(name);
});
hitsRouter.get('/:id', async (req, res) => {
  const file = fs.readFileSync('./logs/' + req.params.id);
  const count = parseInt(file.toString());
  const svg = `<?xml version="1.0"?>
<svg xmlns="http://www.w3.org/2000/svg" width="80" height="20">

<rect width="30" height="20" fill="#555"/>
<rect x="30" width="50" height="20" fill="#4c1"/>

<rect rx="3" width="80" height="20" fill="transparent"/>
	<g fill="#fff" text-anchor="middle"
    font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">
	    <text x="15" y="14">hits</text>
	    <text x="54" y="14">${count}</text>
	</g>
</svg>
`;
  fs.writeFileSync('./logs/' + req.params.id, count + 1, 'utf8');
  res.set('Content-Type', 'image/svg+xml');
  res.set('Cache-Control', 'no-cache');
  res.send(svg);
});

export default hitsRouter;
