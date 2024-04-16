// myPartM.ts
// a Scout-cross to illustrate the definition of arcs

// step-1 : import from geometrix
import type {
	//tContour,
	tParamDef,
	tParamVal,
	tGeom,
	//tExtrude,
	tPageDef
	//tSubInst
	//tSubDesign
} from 'geometrix';
import {
	point,
	contour,
	//contourCircle,
	figure,
	degToRad,
	radToDeg,
	ffix,
	pNumber,
	//pCheckbox,
	//pDropdown,
	initGeom,
	EExtrude,
	EBVolume
} from 'geometrix';

// step-2 : definition of the parameters and more (part-name, svg associated to each parameter, simulation parameters)
const pDef: tParamDef = {
	// partName is used in URL. Choose a name without slash, backslash and space.
	partName: 'myPartM',
	params: [
		//pNumber(name, unit, init, min, max, step)
		pNumber('D1', 'mm', 10, 1, 200, 1),
		pNumber('D2', 'mm', 30, 10, 200, 1),
		pNumber('D3', 'mm', 60, 10, 200, 1),
		pNumber('L1', 'mm', 60, 10, 200, 1),
		pNumber('ES', 'mm', 3, 0, 40, 1),
		pNumber('EL', 'mm', 3, 0, 40, 1),
		pNumber('RS', 'mm', 100, 5, 500, 1),
		pNumber('RL', 'mm', 100, 5, 500, 1),
		pNumber('AS', 'degree', 3, 0, 45, 1),
		pNumber('AL', 'degree', 42, 0, 45, 1)
	],
	paramSvg: {
		D1: 'myPartM_face.svg',
		D2: 'myPartM_face.svg',
		D3: 'myPartM_face.svg',
		L1: 'myPartM_face.svg',
		ES: 'myPartM_face.svg',
		EL: 'myPartM_face.svg',
		RS: 'myPartM_face.svg',
		RL: 'myPartM_face.svg',
		AS: 'myPartM_face.svg',
		AL: 'myPartM_face.svg'
	},
	sim: {
		tMax: 100,
		tStep: 0.5,
		tUpdate: 500 // every 0.5 second
	}
};

// step-3 : definition of the function that creates from the parameter-values the figures and construct the 3D
function pGeom(t: number, param: tParamVal, suffix = ''): tGeom {
	const rGeome = initGeom(pDef.partName + suffix);
	const fig1 = figure();
	rGeome.logstr += `${rGeome.partName} simTime: ${t}\n`;
	try {
		// step-4 : some preparation calculation
		const R1 = param.D1 / 2;
		const R2 = param.D2 / 2;
		const R3 = param.D3 / 2;
		const L12 = param.L1 / 2;
		const aL12 = Math.asin(L12 / param.D3);
		// step-5 : checks on the parameter values
		if (param.D1 > param.D3) {
			throw `err291: D1 ${param.D1} is too large compare to D3 ${param.D3}`;
		}
		if (param.D2 > param.D3) {
			throw `err292: D2 ${param.D2} is too large compare to D3 ${param.D3}`;
		}
		if (aL12 > Math.PI / 4) {
			throw `err295: L1 ${param.L1} is too large compare to D3 ${param.D3}`;
		}
		// step-6 : any logs
		rGeome.logstr += `myPartM: aL12 ${ffix(radToDeg(aL12))} degree\n`;
		// step-7 : drawing of the figures
		// fig1
		const ctrCross = contour(R2, 0);
		// .addSegArc2() defines an arc with an intermediate point
		const pc1 = point(R2, 0); // start of the cross
		const pc2 = point(0, 0).translatePolar(aL12, R3); // second point of the cross
		const pm12 = pc1.middlePoint(pc2); // middle point between pc1 and pc2
		const pi12 = pm12.translatePolar(pc1.angleToPoint(pc2) - Math.PI / 2, param.ES); // intermediate point for arc12
		const pc3 = point(0, 0).translatePolar(Math.PI / 4, R1); // third point of the cross
		const pm23 = pc2.middlePoint(pc3); // middle point between pc2 and pc3
		const pi23 = pm23.translatePolar(pc2.angleToPoint(pc3) + Math.PI / 2, param.EL); // intermediate point for arc23
		const pc4 = point(0, 0).translatePolar(Math.PI / 2 - aL12, R3); // fourth point of the cross
		const pc5 = point(0, R2); // fifth point of the cross
		const pm34 = pc3.middlePoint(pc4); // middle point between pc3 and pc4
		const pi34 = pm34.translatePolar(pc3.angleToPoint(pc4) + Math.PI / 2, param.EL); // intermediate point for arc34
		const pm45 = pc4.middlePoint(pc5); // middle point between pc4 and pc5
		const pi45 = pm45.translatePolar(pc4.angleToPoint(pc5) - Math.PI / 2, param.ES); // intermediate point for arc45
		fig1.addPoint(pc1);
		fig1.addPoint(pc2);
		fig1.addPoint(pc3);
		fig1.addPoint(pc4);
		fig1.addPoint(pc5);
		//fig1.addPoint(pm12);
		//fig1.addPoint(pm23);
		//fig1.addPoint(pm34);
		//fig1.addPoint(pm45);
		fig1.addPoint(pi12);
		fig1.addPoint(pi23);
		fig1.addPoint(pi34);
		fig1.addPoint(pi45);
		//fig1.addMain(contourCircle(0, 0, R1));
		//fig1.addMain(contourCircle(0, 0, R2));
		//fig1.addMain(contourCircle(0, 0, R3));
		ctrCross
			.addPointA(pi12.cx, pi12.cy)
			.addPointA(pc2.cx, pc2.cy)
			.addSegArc2()
			.addPointA(pi23.cx, pi23.cy)
			.addPointA(pc3.cx, pc3.cy)
			.addSegArc2()
			.addPointA(pi34.cx, pi34.cy)
			.addPointA(pc4.cx, pc4.cy)
			.addSegArc2()
			.addPointA(pi45.cx, pi45.cy)
			.addPointA(pc5.cx, pc5.cy)
			.addSegArc2();
		// .addSegArc() defines an arc with a radius, small/large and orientation (ccw/cw)
		const pc6 = point(0, 0).translatePolar(Math.PI / 2 + aL12, R3);
		const pc7 = point(0, 0).translatePolar((3 * Math.PI) / 4, R1);
		const pc8 = point(0, 0).translatePolar(Math.PI - aL12, R3);
		const pc9 = point(-R2, 0);
		ctrCross
			.addPointA(pc6.cx, pc6.cy)
			.addSegArc(param.RS, false, true)
			.addPointA(pc7.cx, pc7.cy)
			.addSegArc(param.RL, false, false)
			.addPointA(pc8.cx, pc8.cy)
			.addSegArc(param.RL, false, false)
			.addPointA(pc9.cx, pc9.cy)
			.addSegArc(param.RS, false, true);
		// .addSegArc3() defines an arc with the tangent at start or end of the arc
		const pc10 = point(0, 0).translatePolar(Math.PI + aL12, R3);
		const pc11 = point(0, 0).translatePolar((5 * Math.PI) / 4, R1);
		const pc12 = point(0, 0).translatePolar((3 * Math.PI) / 2 - aL12, R3);
		const pc13 = point(0, -R2);
		ctrCross
			.addPointA(pc10.cx, pc10.cy)
			.addSegArc3(Math.PI + degToRad(param.AS), true)
			.addPointA(pc11.cx, pc11.cy)
			.addSegArc3((5 * Math.PI) / 4 - degToRad(param.AL), false)
			.addPointA(pc12.cx, pc12.cy)
			.addSegArc3((5 * Math.PI) / 4 + degToRad(param.AL), true)
			.addPointA(pc13.cx, pc13.cy)
			.addSegArc3((3 * Math.PI) / 2 - degToRad(param.AS), false);
		// use again .addSegArc() for the fourth and last quater
		const pc14 = point(0, 0).translatePolar((3 * Math.PI) / 2 + aL12, R3);
		const pc15 = point(0, 0).translatePolar(-Math.PI / 4, R1);
		const pc16 = point(0, 0).translatePolar(-aL12, R3);
		ctrCross
			.addPointA(pc14.cx, pc14.cy)
			.addSegArc(param.RS, false, true)
			.addPointA(pc15.cx, pc15.cy)
			.addSegArc(param.RL, false, false)
			.addPointA(pc16.cx, pc16.cy)
			.addSegArc(param.RL, false, false)
			.closeSegArc(param.RS, false, true);
		//ctrCross.closeSegStroke();
		fig1.addMain(ctrCross);
		// final figure list
		rGeome.fig = {
			face1: fig1
		};
		// step-8 : recipes of the 3D construction
		const designName = rGeome.partName;
		rGeome.vol = {
			extrudes: [
				{
					outName: `subpax_${designName}`,
					face: `${designName}_face1`,
					extrudeMethod: EExtrude.eLinearOrtho,
					length: 1,
					rotate: [0, 0, 0],
					translate: [0, 0, 0]
				}
			],
			volumes: [
				{
					outName: `pax_${designName}`,
					boolMethod: EBVolume.eIdentity,
					inList: [`subpax_${designName}`]
				}
			]
		};
		// step-9 : optional sub-design parameter export
		// sub-design
		rGeome.sub = {};
		// step-10 : final log message
		// finalize
		rGeome.logstr += 'myPartM drawn successfully!\n';
		rGeome.calcErr = false;
	} catch (emsg) {
		rGeome.logstr += emsg as string;
		console.log(emsg as string);
	}
	return rGeome;
}

// step-11 : definiton of the final object that gathers the precedent object and function
const myPartMDef: tPageDef = {
	pTitle: 'My Part-M',
	pDescription: 'A Scout-cross for illustration the three ways for defining arcs',
	pDef: pDef,
	pGeom: pGeom
};

// step-12 : export the final object
export { myPartMDef };
