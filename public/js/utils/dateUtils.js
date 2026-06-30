export function formattaData(data) {

    if (!data) {
        return '';
    }

    return new Date(data).toLocaleDateString('it-IT');
    //return new Date(data).toLocaleString('it-IT');
}