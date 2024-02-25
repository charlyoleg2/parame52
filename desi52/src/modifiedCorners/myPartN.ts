// myPartN.ts
// a Scout-cross to illustrate a combination of arcs and modified corners

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
	//radToDeg,
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
	partName: 'myPartN',
	params: [
		//pNumber(name, unit, init, min, max, step)
		pNumber('D1', 'mm', 10, 1, 200, 1),
		pNumber('D2', 'mm', 30, 10, 200, 1),
		pNumber('D3', 'mm', 60, 10, 200, 1),
		pNumber('L1', 'mm', 60, 10, 200, 1),
		pNumber('AS', 'degree', 3, 0, 45, 1),
		pNumber('AL', 'degree', 42, 0, 45, 1),
		pNumber('RC1', 'mm', 2, 0, 30, 1),
		pNumber('RC2', 'mm', 2, 0, 30, 1),
		pNumber('RC3', 'mm', 2, 0, 30, 1),
		pNumber('RC4', 'mm', 2, 0, 30, 1)
	],
	paramSvg: {
		D1: 'myPartN_face.svg',
		D2: 'myPartN_face.svg',
		D3: 'myPartN_face.svg',
		L1: 'myPartN_face.svg',
		AS: 'myPartN_face.svg',
		AL: 'myPartN_face.svg',
		RC1: 'myPartN_face.svg',
		RC2: 'myPartN_face.svg',
		RC3: 'myPartN_face.svg',
		RC4: 'myPartN_face.svg'
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
		rGeome.logstr += `myPartN: aL12 ${ffix(aL12)} degree\n`;
		// step-7 : drawing of the figures
		// fig1
		const ctrCross = contour(R2, 0);
		// .addSegArc3() defines an arc with the tangent at start or end of the arc
		for (let i = 0; i < 4; i++) {
			const aOffset = (i * Math.PI) / 2;
			const pc2 = point(0, 0).translatePolar(aOffset + aL12, R3);
			const pc3 = point(0, 0).translatePolar(aOffset + Math.PI / 4, R1);
			const pc4 = point(0, 0).translatePolar(aOffset + Math.PI / 2 - aL12, R3);
			const pc5 = point(0, 0).translatePolar(aOffset + Math.PI / 2, R2);
			ctrCross
				.addPointA(pc2.cx, pc2.cy)
				.addSegArc3(Math.PI + degToRad(param.AS), true)
				.addCornerRounded(param.RC1)
				.addPointA(pc3.cx, pc3.cy)
				.addSegArc3((5 * Math.PI) / 4 - degToRad(param.AL), false)
				.addCornerWidened(param.RC2)
				.addPointA(pc4.cx, pc4.cy)
				.addSegArc3((5 * Math.PI) / 4 + degToRad(param.AL), true)
				.addCornerWideAcc(param.RC3)
				.addPointA(pc5.cx, pc5.cy)
				.addSegArc3((3 * Math.PI) / 2 - degToRad(param.AS), false)
				.addCornerRounded(param.RC3);
		}
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
		rGeome.logstr += 'myPartN drawn successfully!\n';
		rGeome.calcErr = false;
	} catch (emsg) {
		rGeome.logstr += emsg as string;
		console.log(emsg as string);
	}
	return rGeome;
}

// step-11 : definiton of the final object that gathers the precedent object and function
const myPartNDef: tPageDef = {
	pTitle: 'My Part-N',
	pDescription: 'A Scout-cross for illustration a combination of arcs and modified corners',
	pDef: pDef,
	pGeom: pGeom
};

// step-12 : export the final object
export { myPartNDef };
