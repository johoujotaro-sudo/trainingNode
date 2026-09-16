export class Lib {
    
    /**
     * �l��null�Aundefined�A�܂��͋󕶎��񂩂ǂ������`�F�b�N����B
     * @param value �`�F�b�N����l�B
     * @returns �l��null�Aundefined�A�܂��͋󕶎���̏ꍇ��true�A����ȊO�̏ꍇ��false�B
     */
    isNullOrEmpty(value: unknown): value is null | undefined | '' {
        if (value === null || value === undefined || value === '') {
            return true;
        }
        return false;
    }

    /**
     * JSON�R�[�h�u���b�N���폜����B
     * @param value JSON�R�[�h�u���b�N���܂ޕ�����B
     * @returns JSON�R�[�h�u���b�N���폜����������B
     */
    removeJsonCodeBlock(value: string): string {
        return value.replace(/```json([\s\S]*?)```/g, '$1').trim();
    }
}