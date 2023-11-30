const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:9999";

const state = {
    data: {},
    listeners: [],
    getState() {
        return this.data;
    },
    setState(newState:object) {
        this.data = newState;
        this.listeners.forEach(listener => listener());
    },
    subscribe(callback) {
        this.listeners.push(callback);
    },
    async signUp(email:string, password:string):Promise<boolean> {
        try {
            const response = await fetch(`${API_BASE_URL}/auth`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ email, password })
            });
            if (response.ok) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            console.log(err);
            return false;
        }
    },
    async login(email:string, password:string):Promise<boolean> {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/token`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ email, password })
            });
            if (response.ok) {
                const promise = await response.json();
                const token = promise.token;
                localStorage.setItem('accessToken', token);
                this.setState({
                    ...this.getState(),
                    user: promise.user
                });
                return true;
            } else {
                return false;
            }
        } catch (err) {
            console.log(err);
            return false;
        }
    },
    async authenticate() {
        try {
            const accessToken = localStorage.getItem("accessToken");
            if (accessToken) {
                const response = await fetch(`${API_BASE_URL}/me`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                });
                if (response.ok) {
                    const promise = await response.json();
                    this.setState({
                        ...this.getState(),
                        user: promise
                    })
                    console.log(`Hola ${promise.first_name}`);
                    return true;
                } else {
                    return false;
                }
            }
        } catch (err) {
            console.log(err);
            return false;
        }
    },
    async setUserData(user_id:number, first_name:string, last_name:string, phone_number:string, city:string):Promise<boolean> {
        try {
            const response = await fetch(`${API_BASE_URL}/set-user-data`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_id, first_name, last_name, phone_number, city })
            });
            if (response.ok) {
                const promise = await response.json();
                console.log("Tus datos fueron actualizados", promise);
                return true;
            } else {
                return false;
            }
        } catch (err) {
            console.log(err);
            return false;
        }
    },
    async updatePassword(password:string, confirmPassword:string):Promise<boolean> {
        try {
            const response = await fetch(`${API_BASE_URL}/password`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ password, confirmPassword })
            });
            if (response.ok) {
                const promise = await response.json();
                console.log("Tu contraseña fue actualizada.", promise);
                return true;
            } else {
                return false;
            }
        } catch (err) {
            console.log(err);
            return false;
        }
    },
    async uploadPetPicture(imageURL:string) {
        try {
            const response = await fetch(`${API_BASE_URL}/upload-image`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ imageURL })
            });
            if(response.ok) {
                const imageSrc:string = await response.json();
                return imageSrc;
            };
        } catch (err) {
            console.error(err);
        }
    },
    async setPetData(petName:string, lastSeen:string, imageURL:string):Promise<string | false> {
        try {
            const response = await fetch(`${API_BASE_URL}/setPetData`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ petName, lastSeen, imageURL })
            });
            if(response.ok) {
                const imageSrc = await response.json();
                return imageSrc;
            } else {
                return false;
            }
        } catch (err) {
            console.log(err);
            return false;
        }
    },
    async getNearPets(params: {lat:number, lng:number}):Promise<boolean> {
        const response = await fetch(`${API_BASE_URL}/reports/find-near-pets?lat=${params.lat}&lng=${params.lng}`);
        const nearLostPets = await response.json();
        this.setState({
            ...this.getState(),
            nearLostPets
        })
        return true;
    },
    async reportPet(params:{owner_id:number, owner_name:string, owner_phone_number:string, pet_name: string, message:string, last_seen_lat:number, last_seen_lon:number, last_seen:string, img:string}):Promise<boolean> {
        try {
            const response = await fetch(`${API_BASE_URL}/reports/create`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(params)
            });
            if(response.ok) {
                const report = await response.json();
                return report;
            } else {
                return false;
            }
        } catch (err) {
            console.log(err);
            return false;
        }
    },
    async getMyReports(userId:number):Promise<boolean> {
        try {
            const response = await fetch(`${API_BASE_URL}/reports/${userId}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                }
            });
            if(response.ok) {
                const myReports = await response.json();
                this.setState({
                    ...this.getState(),
                    myReports
                })
                return myReports;
            } else {
                return false;
            }
        } catch (err) {
            console.log(err);
            return false;
        }
    },
    selectReportToEdit(reportToEdit:object):void {
        this.setState({
            ...this.getState(),
            reportToEdit
        })
    },
    async editReport(params:{id:number, owner_id:number, owner_name:string, owner_phone_number:string, pet_name: string, message:string, last_seen_lat:number, last_seen_lon:number, last_seen:string, img:string}):Promise<boolean> {
        try {
            const response = await fetch(`${API_BASE_URL}/reports/edit-report`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(params)
            });
            if(response.ok) {
                const editedReport = await response.json();
                return editedReport;
            } else {
                return false;
            }
        } catch (err) {
            console.log(err);
            return false;
        }
    },
    async deleteReport(reportId:number):Promise<boolean> {
        try {
            const response = await fetch(`${API_BASE_URL}/reports/delete`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({reportId})
            });
            if(response.ok) {
                const deletedReport = await response.json();
                return deletedReport;
            } else {
                return false;
            }
        } catch (err) {
            console.log(err);
            return false;
        }
    }
};

export {state};