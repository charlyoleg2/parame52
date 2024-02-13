// myRectangle.ts
// a simple design (just a rectangle) for developing paxApps (desiXY-cli and desiXY-ui)

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
	contour,
	//contourCircle,
	figure,
	//degToRad,
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
	partName: 'myRectangle',
	params: [
		//pNumber(name, unit, init, min, max, step)
		pNumber('W1', 'mm', 80, 10, 200, 1),
		pNumber('H1', 'mm', 60, 10, 200, 1)
	],
	paramSvg: {
		W1: 'myRectangle.svg',
		H1: 'myRectangle.svg'
	},
	sim: {
		tMax: 100,
		tStep: 0.5,
		tUpdate: 500 // every 0.5 second
	}
};

// step-3 : definition of the function that creates from the parameter-values the figures and construct the 3D
function pGeom(t: number, param: tParamVal): tGeom {
	const rGeome = initGeom(pDef.partName);
	const fig1 = figure();
	rGeome.logstr += `${rGeome.partName} simTime: ${t}\n`;
	try {
		// step-4 : some preparation calculation
		// step-5 : checks on the parameter values
		// step-6 : any logs
		rGeome.logstr += `myRectangle area: ${ffix(param.W1 * param.H1)} mm2\n`;
		// step-7 : drawing of the figures
		// fig1
		const ctrRect = contour(0, 0)
			.addSegStrokeR(param.W1, 0)
			.addSegStrokeR(0, param.H1)
			.addSegStrokeR(-param.W1, 0)
			.closeSegStroke();
		fig1.addMain(ctrRect);
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
		rGeome.logstr += 'myRectangle drawn successfully!\n';
		rGeome.calcErr = false;
	} catch (emsg) {
		rGeome.logstr += emsg as string;
		console.log(emsg as string);
	}
	return rGeome;
}

// step-11 : definiton of the final object that gathers the precedent object and function
const myRectangleDef: tPageDef = {
	pTitle: 'My Rectangle',
	pDescription: 'A simple rectangle for developing paxApps (desiXY-cli and desiXY-ui)',
	pDef: pDef,
	pGeom: pGeom
};

// step-12 : export the final object
export { myRectangleDef };
