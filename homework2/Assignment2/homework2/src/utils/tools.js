function getRotationPrecomputeL(precompute_L, rotationMatrix){ // Computed the rotated lighting basis from M3 and M5

	let R = mat4Matrix2mathMatrix(rotationMatrix);

	let R3 = computeSquareMatrix_3by3(R);
	let R5 = computeSquareMatrix_5by5(R);

	let result = [];
    for(let i = 0; i < 9; i++){
        result[i] = [];
    }

	for(var i = 0; i < 3; i += 1){

		// Note: Band l = 0 (single coefficient) is invariant under rotation so a constant
		// Rotating Band l = 1 spherical harmonic coefficients by R3
		let SH_l1C3 = math.multiply(R3, [precompute_L[1][i], precompute_L[2][i], precompute_L[3][i]]);
		// Rotate Band l = 2 spherical harmonic coefficients by R5
		let SH_l2C5 = math.multiply(R5, [precompute_L[4][i], precompute_L[5][i], precompute_L[6][i], precompute_L[7][i], precompute_L[8][i]]);

		result[0][i] = precompute_L[0][i];
		result[1][i] = SH_l1C3._data[0];
        result[2][i] = SH_l1C3._data[1];
        result[3][i] = SH_l1C3._data[2];
        result[4][i] = SH_l2C5._data[0];
        result[5][i] = SH_l2C5._data[1];
        result[6][i] = SH_l2C5._data[2];
        result[7][i] = SH_l2C5._data[3];
        result[8][i] = SH_l2C5._data[4];
	}

	return result;
}

function computeSquareMatrix_3by3(rotationMatrix){ // 计算方阵SA(-1) 3*3 
	
	// 1、pick ni - {ni}
	let n1 = [1, 0, 0, 0]; let n2 = [0, 0, 1, 0]; let n3 = [0, 1, 0, 0];

	// 2、{P(ni)} - A  A_inverse
    let p_n1 = SHEval(n1[0], n1[1], n1[2], 3)
    let p_n2 = SHEval(n2[0], n2[1], n2[2], 3)
    let p_n3 = SHEval(n3[0], n3[1], n3[2], 3)

	let A = math.matrix([
		[p_n1[1], p_n2[1], p_n3[1]],
		[p_n1[2], p_n2[2], p_n3[2]],
		[p_n1[3], p_n2[3], p_n3[3]]
	]);

	let A_inverse = math.inv(A);

	// 3、用 R 旋转 ni - {R(ni)}
	let r1 = math.multiply(rotationMatrix, n1);
	let r2 = math.multiply(rotationMatrix, n2);
	let r3 = math.multiply(rotationMatrix, n3);

	// 4、R(ni) SH投影 - S
	p_r1 = SHEval(r1[0], r1[1], r1[2], 3);
	p_r2 = SHEval(r2[0], r2[1], r2[2], 3);
	p_r3 = SHEval(r3[0], r3[1], r3[2], 3);

	let S = math.matrix([
		[p_r1[1], p_r2[1], p_r3[1]],
		[p_r1[2], p_r2[2], p_r3[2]],
		[p_r1[3], p_r2[3], p_r3[3]]
	]);


	// 5、S*A_inverse
	return math.multiply(S, A_inverse);

}

function computeSquareMatrix_5by5(rotationMatrix){ // 计算方阵SA(-1) 5*5
	
	// 1、pick ni - {ni}
	let k = 1 / math.sqrt(2);
	let n1 = [1, 0, 0, 0]; let n2 = [0, 0, 1, 0]; let n3 = [k, k, 0, 0]; 
	let n4 = [k, 0, k, 0]; let n5 = [0, k, k, 0];

	// 2、{P(ni)} - A  A_inverse
	let p_n1 = SHEval(n1[0], n1[1], n1[2], 3)
    let p_n2 = SHEval(n2[0], n2[1], n2[2], 3)
    let p_n3 = SHEval(n3[0], n3[1], n3[2], 3)
	let p_n4 = SHEval(n4[0], n4[1], n4[2], 3)
    let p_n5 = SHEval(n5[0], n5[1], n5[2], 3)


	let A = math.matrix([
		[p_n1[4], p_n2[4], p_n3[4], p_n4[4], p_n5[4]],
		[p_n1[5], p_n2[5], p_n3[5], p_n4[5], p_n5[5]],
		[p_n1[6], p_n2[6], p_n3[6], p_n4[6], p_n5[6]],
		[p_n1[7], p_n2[7], p_n3[7], p_n4[7], p_n5[7]],
		[p_n1[8], p_n2[8], p_n3[8], p_n4[8], p_n5[8]]
	]);

	let A_inverse = math.inv(A);

	// 3、用 R 旋转 ni - {R(ni)}
	let r1 = math.multiply(rotationMatrix, n1);
	let r2 = math.multiply(rotationMatrix, n2);
	let r3 = math.multiply(rotationMatrix, n3);
	let r4 = math.multiply(rotationMatrix, n4);
	let r5 = math.multiply(rotationMatrix, n5);

	// 4、R(ni) SH投影 - S
	p_r1 = SHEval(r1[0], r1[1], r1[2], 3);
	p_r2 = SHEval(r2[0], r2[1], r2[2], 3);
	p_r3 = SHEval(r3[0], r3[1], r3[2], 3);
	p_r4 = SHEval(r4[0], r4[1], r4[2], 3);
	p_r5 = SHEval(r5[0], r5[1], r5[2], 3);


	let S = math.matrix([
		[p_r1[4], p_r2[4], p_r3[4], p_r4[4], p_r5[4]],
		[p_r1[5], p_r2[5], p_r3[5], p_r4[5], p_r5[5]],
		[p_r1[6], p_r2[6], p_r3[6], p_r4[6], p_r5[6]],
		[p_r1[7], p_r2[7], p_r3[7], p_r4[7], p_r5[7]],
		[p_r1[8], p_r2[8], p_r3[8], p_r4[8], p_r5[8]]
	]);

	// 5、S*A_inverse
	return math.multiply(S, A_inverse);

}

function mat4Matrix2mathMatrix(rotationMatrix){

	let mathMatrix = [];
	for(let i = 0; i < 4; i++){
		let r = [];
		for(let j = 0; j < 4; j++){
			r.push(rotationMatrix[i*4+j]);
		}
		mathMatrix.push(r);
	}
	    //return math.matrix(mathMatrix)
		return math.transpose(mathMatrix)
		// Edit End

}

function getMat3ValueFromRGB(precomputeL){

    let colorMat3 = [];
    for(var i = 0; i<3; i++){
        colorMat3[i] = mat3.fromValues( precomputeL[0][i], precomputeL[1][i], precomputeL[2][i],
										precomputeL[3][i], precomputeL[4][i], precomputeL[5][i],
										precomputeL[6][i], precomputeL[7][i], precomputeL[8][i] ); 
	}
    return colorMat3;
}