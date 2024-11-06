
export class vec2
{
	constructor(x, y)
	{
		if (x == undefined)
			this.x = 0;
		else
			this.x = x;
		if (y == undefined && x != undefined)
			this.y = x;
		else if (y != undefined)
			this.y = y;
		else
			this.y = 0;
	}
	
	copy()
	{
		return new vec2(this.x, this.y);
	}

	multiply(vec)
	{
		return new vec2(this.x * vec.x, this.y * vec.y);
	}

	divide(vec)
	{
		return new vec2(this.x / vec.x, this.y / vec.y);
	}

	add(vec)
	{
		return new vec2(this.x + vec.x, this.y + vec.y);
	}

	subtract(vec)
	{
		return new vec2(this.x - vec.x, this.y - vec.y);
	}
	
	clamp(high, low)
	{
		return new vec2(
			Math.min(Math.max(this.x, low.x), high.x),
			Math.min(Math.max(this.y, low.y), high.y)
		)
	}

	length()
	{
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	distTo(vec)
	{
		return this.subtract(vec).length();
	}
}
